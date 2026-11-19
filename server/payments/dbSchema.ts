import { db } from "../db";

export function initPaymentsDatabase() {
  console.log("[YOVE PAYMENTS] Initializing Payment System Database Tables...");

  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'PEN',
      course_id TEXT,
      learning_path_id TEXT,
      status TEXT DEFAULT 'ACTIVE',
      metadata_json TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payment_coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      discount_value REAL NOT NULL,
      currency TEXT DEFAULT 'PEN',
      applicable_product_type TEXT,
      applicable_course_id TEXT,
      usage_limit INTEGER,
      usage_count INTEGER DEFAULT 0,
      per_user_limit INTEGER DEFAULT 1,
      start_date TEXT,
      expires_at TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payment_orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      currency TEXT DEFAULT 'PEN',
      coupon_id TEXT,
      coupon_code TEXT,
      payment_provider TEXT NOT NULL,
      payment_id TEXT,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_doc_type TEXT,
      customer_doc_number TEXT,
      items_json TEXT NOT NULL,
      idempotency_key TEXT UNIQUE NOT NULL,
      ip_address TEXT,
      fraud_score REAL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS payment_transactions (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_transaction_id TEXT,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'PEN',
      status TEXT NOT NULL,
      payment_method TEXT,
      raw_response_json TEXT,
      error_message TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES payment_orders(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS payment_webhooks_log (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_id TEXT UNIQUE NOT NULL,
      payload_json TEXT,
      processed INTEGER DEFAULT 0,
      processed_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payment_refunds (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      payment_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'PEN',
      reason TEXT NOT NULL,
      provider_refund_id TEXT,
      admin_user_id TEXT NOT NULL,
      status TEXT DEFAULT 'COMPLETED',
      created_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES payment_orders(id)
    );

    CREATE TABLE IF NOT EXISTS payment_invoices (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      doc_type TEXT DEFAULT 'BOLETA',
      doc_number TEXT NOT NULL,
      tax_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_address TEXT,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL,
      currency TEXT DEFAULT 'PEN',
      pdf_url TEXT,
      status TEXT DEFAULT 'ISSUED',
      created_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES payment_orders(id)
    );
  `);

  // Create indices
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_orders_user ON payment_orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON payment_orders(status);
    CREATE INDEX IF NOT EXISTS idx_transactions_order ON payment_transactions(order_id);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_code ON payment_coupons(code);
  `);

  seedDefaultCouponsAndProducts();
}

function seedDefaultCouponsAndProducts() {
  const now = new Date().toISOString();

  // Seed default coupons if not exist
  const existingCoupons = (db.prepare("SELECT COUNT(*) as cnt FROM payment_coupons").get() as any).cnt;
  if (existingCoupons === 0) {
    const coupons = [
      {
        id: 'coup_YOVE2026',
        code: 'YOVE2026',
        type: 'PERCENTAGE',
        discount_value: 20, // 20% discount
        currency: 'PEN',
        applicable_product_type: 'ALL',
        usage_limit: 1000,
        per_user_limit: 1,
        is_active: 1,
      },
      {
        id: 'coup_MECATRONICA50',
        code: 'MECATRONICA50',
        type: 'FIXED_AMOUNT',
        discount_value: 50, // S/ 50 discount
        currency: 'PEN',
        applicable_product_type: 'COURSE',
        usage_limit: 500,
        per_user_limit: 1,
        is_active: 1,
      },
      {
        id: 'coup_SUPERPROMO',
        code: 'SUPERPROMO',
        type: 'PERCENTAGE',
        discount_value: 30, // 30% discount
        currency: 'PEN',
        applicable_product_type: 'ALL',
        usage_limit: 200,
        per_user_limit: 1,
        is_active: 1,
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO payment_coupons (id, code, type, discount_value, currency, applicable_product_type, usage_limit, usage_count, per_user_limit, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
    `);

    for (const c of coupons) {
      stmt.run(c.id, c.code, c.type, c.discount_value, c.currency, c.applicable_product_type, c.usage_limit, c.per_user_limit, c.is_active, now);
    }
    console.log("[YOVE PAYMENTS] Default Coupons Seeded.");
  }

  // Populate payment_products from courses table if products are empty
  const existingProducts = (db.prepare("SELECT COUNT(*) as cnt FROM payment_products").get() as any).cnt;
  if (existingProducts === 0) {
    const courses = db.prepare("SELECT id, title, description, price FROM courses WHERE isPublished = 1").all() as any[];
    const productStmt = db.prepare(`
      INSERT INTO payment_products (id, name, description, type, price, currency, course_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'PEN', ?, 'ACTIVE', ?, ?)
    `);

    for (const course of courses) {
      const prodId = `prod_course_${course.id}`;
      const pricePEN = course.price || 299;
      productStmt.run(prodId, course.title, course.description || '', 'COURSE', pricePEN, course.id, now, now);
    }

    // Seed bundles / certifications / subscriptions
    const specialProducts = [
      {
        id: 'prod_bundle_ev_master',
        name: 'Paquete Maestro Electromovilidad & Diagnóstico EV',
        description: 'Acceso completo a todos los cursos de Diagnóstico de Baterías HV, Inversores y Motores Eléctricos.',
        type: 'BUNDLE',
        price: 899,
      },
      {
        id: 'prod_cert_expert_diag',
        name: 'Certificación Profesional: Especialista en Diagnóstico Automotriz Avanzado',
        description: 'Examen de certificación oficial, emisión de código de verificación QR y diploma digital respaldado.',
        type: 'CERTIFICATION',
        price: 499,
      },
      {
        id: 'prod_sub_pro_diagnosta_annual',
        name: 'Membresía PRO Diagnosta — Anual',
        description: 'Acceso ilimitado a todos los 50+ cursos de YOVE Academy, Laboratorios Virtuales y YOVE AI por 1 año.',
        type: 'SUBSCRIPTION',
        price: 1990,
      }
    ];

    for (const sp of specialProducts) {
      productStmt.run(sp.id, sp.name, sp.description, sp.type, sp.price, null, now, now);
    }

    console.log("[YOVE PAYMENTS] Default Products Seeded from Course Catalog & Bundles.");
  }
}

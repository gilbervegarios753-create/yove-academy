import { Router } from "express";
import { db } from "../db";
import { PaymentManager } from "./providers/PaymentManager";
import { OrderEngine } from "./engines/OrderEngine";
import { CouponEngine } from "./engines/CouponEngine";
import { WebhookEngine } from "./engines/WebhookEngine";
import { RefundEngine } from "./engines/RefundEngine";
import { EnrollmentEngine } from "./engines/EnrollmentEngine";
import { getUserByToken } from "../auth";
import { PAYMENTS_CONFIG } from "./config";
import { PaymentOrderItem, PaymentProviderType } from "./types";

const router = Router();

// Auth Middleware Helper
const requireUser = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : (req.headers['x-session-token'] || req.query.token);
  if (!token) {
    return res.status(401).json({ error: "No autorizado. Inicie sesión para continuar." });
  }
  const user = getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: "Sesión inválida o expirada." });
  }
  req.user = user;
  next();
};

// Admin Middleware Helper
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ error: "Acceso denegado. Se requieren permisos de Administrador." });
  }
  next();
};

// 1. Get Available Active Payment Providers
router.get("/providers", (req, res) => {
  try {
    const providers = PaymentManager.getInstance().listActiveProviders();
    res.json({ success: true, providers, defaultCurrency: PAYMENTS_CONFIG.currencyDefault });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Products Catalog for Payments
router.get("/products", (req, res) => {
  try {
    const products = db.prepare("SELECT * FROM payment_products WHERE status = 'ACTIVE' ORDER BY price DESC").all();
    res.json({ success: true, products });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Validate Cart & Server Prices
router.post("/cart/validate", (req, res) => {
  try {
    const { items, couponCode, userId } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío." });
    }

    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const product = db.prepare("SELECT * FROM payment_products WHERE id = ? AND status = 'ACTIVE'").get(item.productId) as any;
      if (product) {
        const qty = item.quantity || 1;
        const linePrice = product.price * qty;
        subtotal += linePrice;

        // Check if user already owns this course
        let isAlreadyEnrolled = false;
        if (userId && product.course_id) {
          const existing = db.prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = 'ACTIVE'").get(userId, product.course_id);
          if (existing) isAlreadyEnrolled = true;
        }

        validatedItems.push({
          productId: product.id,
          courseId: product.course_id,
          name: product.name,
          type: product.type,
          unitPrice: product.price,
          quantity: qty,
          linePrice,
          isAlreadyEnrolled
        });
      }
    }

    let discount = 0;
    let couponMessage = '';
    let couponValid = false;

    if (couponCode) {
      const couponRes = CouponEngine.validateCoupon(couponCode, userId, subtotal, validatedItems);
      if (couponRes.valid) {
        discount = couponRes.discountAmount;
        couponValid = true;
        couponMessage = couponRes.message || '';
      } else {
        couponMessage = couponRes.message || 'Cupón inválido.';
      }
    }

    const taxableSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round((taxableSubtotal * PAYMENTS_CONFIG.taxRate) * 100) / 100;
    const total = Math.round(taxableSubtotal * 100) / 100;

    res.json({
      success: true,
      summary: {
        subtotal,
        discount,
        tax,
        total,
        currency: PAYMENTS_CONFIG.currencyDefault,
        itemsCount: validatedItems.length,
        couponValid,
        couponMessage,
      },
      items: validatedItems
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Validate Coupon Endpoint
router.post("/coupons/validate", requireUser, (req: any, res) => {
  try {
    const { code, subtotal, items } = req.body;
    const result = CouponEngine.validateCoupon(code, req.user.id, subtotal || 0, items || []);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Create Order with Idempotency Key
router.post("/orders", requireUser, (req: any, res) => {
  try {
    const {
      customerEmail,
      customerName,
      customerDocType,
      customerDocNumber,
      items,
      couponCode,
      paymentProvider,
      idempotencyKey
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Debe incluir productos en la orden." });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const key = idempotencyKey || `idemp_${req.user.id}_${Date.now()}`;

    const order = OrderEngine.createOrder({
      userId: req.user.id,
      customerEmail: customerEmail || req.user.email,
      customerName: customerName || req.user.full_name,
      customerDocType,
      customerDocNumber,
      items,
      couponCode,
      paymentProvider: paymentProvider || 'culqi',
      idempotencyKey: key,
      ipAddress: String(clientIp)
    });

    res.json({ success: true, order });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Checkout Execution (Initiate charge / redirect)
router.post("/checkout", requireUser, async (req: any, res) => {
  try {
    const { orderId, paymentMethodToken, paymentMethodType, returnUrl } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: "ID de orden requerido." });
    }

    const order = OrderEngine.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada." });
    }

    if (order.user_id !== req.user.id && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: "No tienes permiso para pagar esta orden." });
    }

    if (order.status === 'PAID') {
      return res.json({ success: true, message: "La orden ya ha sido pagada previamente.", order });
    }

    const provider = PaymentManager.getInstance().getProvider(order.payment_provider);
    const paymentResult = await provider.createPayment({
      order,
      paymentMethodToken,
      paymentMethodType: paymentMethodType || 'card',
      returnUrl
    });

    if (!paymentResult.success) {
      OrderEngine.updateOrderStatus(orderId, 'FAILED');
      return res.status(400).json({ error: paymentResult.errorMessage || "Falló el procesamiento del pago." });
    }

    // Record transaction
    const txId = `pay_${Date.now()}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO payment_transactions (
        id, order_id, user_id, provider, provider_transaction_id,
        amount, currency, status, payment_method, raw_response_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      txId, order.id, order.user_id, order.payment_provider, paymentResult.providerTransactionId,
      order.total, order.currency, paymentResult.status, paymentMethodType || 'card',
      JSON.stringify(paymentResult.rawResponse), now, now
    );

    // If payment status is PAID (direct charge / Yape / sandbox verification)
    if (paymentResult.status === 'PAID') {
      OrderEngine.updateOrderStatus(order.id, 'PAID', txId);

      // Trigger enrollment
      const items: PaymentOrderItem[] = JSON.parse(order.items_json);
      const enrollmentResult = EnrollmentEngine.enrollUserFromOrder({
        userId: req.user.id,
        orderId: order.id,
        items
      });

      // Issue invoice
      const docType = order.customer_doc_type === 'RUC' ? 'FACTURA' : 'BOLETA';
      const docNum = `B2026-${Math.floor(100000 + Math.random() * 900000)}`;
      db.prepare(`
        INSERT INTO payment_invoices (
          id, order_id, user_id, doc_type, doc_number, tax_id,
          customer_name, subtotal, tax, total, currency, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ISSUED', ?)
      `).run(
        `inv_${Date.now()}`, order.id, req.user.id, docType, docNum,
        order.customer_doc_number || '10203040', order.customer_name,
        order.subtotal, order.tax, order.total, order.currency, now
      );

      return res.json({
        success: true,
        orderStatus: 'PAID',
        paymentResult,
        enrolledCourses: enrollmentResult.enrolledCourses,
        message: "¡Pago completado con éxito! Cursos liberados en tu cuenta."
      });
    }

    res.json({
      success: true,
      orderStatus: 'PENDING',
      paymentResult,
      message: "Procesando pago..."
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Verify Order Payment Status
router.get("/orders/:orderId/verify", requireUser, (req: any, res) => {
  try {
    const { orderId } = req.params;
    const order = OrderEngine.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada." });
    }

    const tx = db.prepare("SELECT * FROM payment_transactions WHERE order_id = ? ORDER BY created_at DESC LIMIT 1").get(orderId) as any;
    const invoice = db.prepare("SELECT * FROM payment_invoices WHERE order_id = ?").get(orderId) as any;

    res.json({
      success: true,
      order,
      transaction: tx,
      invoice
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Student Payment History & Invoices
router.get("/my-payments", requireUser, (req: any, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, i.doc_number, i.doc_type, i.pdf_url
      FROM payment_orders o
      LEFT JOIN payment_invoices i ON o.id = i.order_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).all(req.user.id) as any[];

    const enrichedOrders = orders.map(o => ({
      ...o,
      items: JSON.parse(o.items_json || '[]')
    }));

    const invoices = db.prepare("SELECT * FROM payment_invoices WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);

    res.json({
      success: true,
      orders: enrichedOrders,
      invoices
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Provider Webhooks (Culqi, Mercado Pago, Stripe)
router.post("/webhooks/:provider", async (req, res) => {
  try {
    const providerName = req.params.provider as PaymentProviderType;
    const result = await WebhookEngine.processWebhook(providerName, req.headers, req.body);
    res.json(result);
  } catch (err: any) {
    console.error(`[Webhook Route Error] ${req.params.provider}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// 10. Admin Sales Center Metrics
router.get("/admin/sales", requireUser, requireAdmin, (req, res) => {
  try {
    const totalSales = (db.prepare("SELECT SUM(total) as sum FROM payment_orders WHERE status = 'PAID'").get() as any).sum || 0;
    const totalOrders = (db.prepare("SELECT COUNT(*) as cnt FROM payment_orders WHERE status = 'PAID'").get() as any).cnt;
    const pendingOrders = (db.prepare("SELECT COUNT(*) as cnt FROM payment_orders WHERE status = 'PENDING'").get() as any).cnt;
    const totalRefunds = (db.prepare("SELECT SUM(amount) as sum FROM payment_refunds").get() as any).sum || 0;

    const salesByProvider = db.prepare(`
      SELECT payment_provider as provider, COUNT(*) as count, SUM(total) as revenue 
      FROM payment_orders WHERE status = 'PAID' 
      GROUP BY payment_provider
    `).all();

    const recentOrders = db.prepare(`
      SELECT o.*, u.full_name as user_name 
      FROM payment_orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC LIMIT 20
    `).all() as any[];

    const enrichedRecentOrders = recentOrders.map(o => ({
      ...o,
      items: JSON.parse(o.items_json || '[]')
    }));

    const recentRefunds = db.prepare(`
      SELECT r.*, u.full_name as user_name 
      FROM payment_refunds r 
      LEFT JOIN users u ON r.user_id = u.id 
      ORDER BY r.created_at DESC LIMIT 10
    `).all();

    res.json({
      success: true,
      metrics: {
        totalSales,
        totalOrders,
        pendingOrders,
        totalRefunds,
        netRevenue: totalSales - totalRefunds,
        salesByProvider,
        recentOrders: enrichedRecentOrders,
        recentRefunds
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Admin Process Refund
router.post("/admin/refunds", requireUser, requireAdmin, async (req: any, res) => {
  try {
    const { orderId, reason, amount } = req.body;
    if (!orderId || !reason) {
      return res.status(400).json({ error: "ID de orden y motivo de reembolso requeridos." });
    }

    const result = await RefundEngine.processRefund({
      orderId,
      adminUserId: req.user.id,
      reason,
      amount
    });

    res.json({ success: true, result, message: "Reembolso procesado con éxito." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

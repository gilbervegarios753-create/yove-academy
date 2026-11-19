import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { hashPassword } from './auth';
import { runMigrations } from './migrations';
import { seedCoreData } from './seedCoreData';
import { seedVehiclesData } from './seedVehicles';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'yove_academy.db');

function getDatabaseConnection(filepath: string): DatabaseSync {
  try {
    if (fs.existsSync(filepath)) {
      const testDb = new DatabaseSync(filepath);
      testDb.exec("PRAGMA quick_check;");
      return testDb;
    }
  } catch (err) {
    console.error("Database file corrupted or invalid, resetting database file...", err);
    try {
      fs.unlinkSync(filepath);
    } catch (e) {
      fs.renameSync(filepath, `${filepath}.corrupted.${Date.now()}`);
    }
  }
  return new DatabaseSync(filepath);
}

export const db = getDatabaseConnection(dbPath);

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'STUDENT',
      full_name TEXT NOT NULL,
      avatar_url TEXT,
      country TEXT,
      workshop_name TEXT,
      xp INTEGER DEFAULT 0,
      level_name TEXT DEFAULT 'Técnico',
      streak_days INTEGER DEFAULT 0,
      study_hours INTEGER DEFAULT 0,
      subscription TEXT DEFAULT 'free',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_login TEXT,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      tier TEXT DEFAULT 'free',
      plan TEXT DEFAULT 'free',
      status TEXT DEFAULT 'active',
      gateway TEXT DEFAULT 'stripe',
      billing_cycle TEXT DEFAULT 'annual',
      amount REAL DEFAULT 0,
      start_date TEXT,
      end_date TEXT,
      current_period_end TEXT,
      provider TEXT,
      provider_customer_id TEXT,
      provider_subscription_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'succeeded',
      tier TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      level TEXT,
      duration TEXT,
      instructor TEXT,
      rating REAL DEFAULT 5.0,
      image TEXT,
      modules_json TEXT
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      enrolled_at TEXT NOT NULL,
      progress_percent INTEGER DEFAULT 0,
      UNIQUE(user_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      module_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at TEXT,
      UNIQUE(user_id, course_id, module_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      quiz_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      passed INTEGER NOT NULL,
      answers_json TEXT,
      attempt_number INTEGER DEFAULT 1,
      completed_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      verification_code TEXT UNIQUE NOT NULL,
      issued_at TEXT NOT NULL,
      score INTEGER NOT NULL,
      hours TEXT NOT NULL,
      status TEXT DEFAULT 'valid'
    );

    CREATE TABLE IF NOT EXISTS gamification_log (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      action_type TEXT NOT NULL,
      xp_earned INTEGER NOT NULL,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      author_id TEXT,
      author_name TEXT,
      author_avatar TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      tags_json TEXT,
      vehicle_context_json TEXT,
      solved_comment_id TEXT,
      likes INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      solved INTEGER DEFAULT 0,
      hidden INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS community_comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      user_id TEXT,
      author_id TEXT,
      author_name TEXT,
      author_avatar TEXT,
      parent_id TEXT,
      content TEXT NOT NULL,
      is_solution INTEGER DEFAULT 0,
      hidden INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS vehicle_brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT,
      country TEXT,
      description TEXT,
      data_json TEXT
    );

    CREATE TABLE IF NOT EXISTS dtc_database (
      code TEXT PRIMARY KEY,
      system TEXT,
      description TEXT,
      causes_json TEXT,
      solutions_json TEXT
    );

    CREATE TABLE IF NOT EXISTS diagnostic_cases (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      vehicle TEXT NOT NULL,
      symptom TEXT NOT NULL,
      dtc TEXT,
      difficulty TEXT,
      hints_json TEXT,
      solution TEXT,
      xp_reward INTEGER DEFAULT 100
    );

    CREATE TABLE IF NOT EXISTS case_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      case_id TEXT NOT NULL,
      attempt_id TEXT,
      steps_json TEXT,
      hints_used INTEGER DEFAULT 0,
      tests_performed INTEGER DEFAULT 0,
      score INTEGER NOT NULL,
      accuracy INTEGER DEFAULT 100,
      time_seconds INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 1,
      started_at TEXT,
      completed_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lab_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lab_type TEXT NOT NULL,
      scenario_id TEXT,
      score INTEGER NOT NULL,
      errors_count INTEGER DEFAULT 0,
      time_seconds INTEGER DEFAULT 0,
      explanation TEXT,
      xp_earned INTEGER DEFAULT 0,
      completed_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      conversation_id TEXT UNIQUE NOT NULL,
      title TEXT DEFAULT 'Conversación AI',
      mode TEXT DEFAULT 'aprender',
      messages_json TEXT,
      vehicle_context_json TEXT,
      created_at TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ai_usage_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      mode TEXT,
      model TEXT,
      tokens_approx INTEGER,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      metadata_json TEXT
    );

    CREATE TABLE IF NOT EXISTS garage_favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      item_data TEXT,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, item_type, item_id)
    );

    CREATE TABLE IF NOT EXISTS garage_recent (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      vehicle_title TEXT NOT NULL,
      vehicle_id TEXT NOT NULL,
      brand_name TEXT,
      visited_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS garage_vehicles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      engine TEXT,
      vin TEXT,
      transmission TEXT,
      fuel_type TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS community_reactions (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      reaction_type TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(target_type, target_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS community_reports (
      id TEXT PRIMARY KEY,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS community_moderation_actions (
      id TEXT PRIMARY KEY,
      moderator_id TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      action TEXT NOT NULL,
      reason TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      target_id TEXT,
      metadata_json TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      subscription_id TEXT,
      status TEXT NOT NULL,
      invoice_date TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      provider_invoice_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      admin_user_id TEXT NOT NULL,
      licenses_total INTEGER NOT NULL,
      licenses_used INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
    CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
    CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
  `);

  runMigrations();

  seedInitialData();
  seedCoreData();
  seedVehiclesData();
}

function seedInitialData() {
  const now = new Date().toISOString();

  // Seed default users if empty
  const userCountStmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const userCount = (userCountStmt.get() as any).count;

  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, role, full_name, avatar_url, country, workshop_name, xp, level_name, streak_days, study_hours, subscription, created_at, updated_at, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const demoHash = hashPassword('Demo1234!');
    const defaultUsers = [
      ['usr_superadmin', 'superadmin@yoveacademy.com', demoHash, 'SUPER_ADMIN', 'Ing. Carlos Mendoza (Super Admin)', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'Perú', 'Sede Central YOVE', 15400, 'Experto YOVE', 45, 240, 'enterprise', now, now],
      ['usr_admin', 'admin@yoveacademy.com', demoHash, 'ADMIN', 'Dra. Elena Rostova (Admin Académico)', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', 'México', 'YOVE Campus Online', 9800, 'Diagnosta', 30, 180, 'pro', now, now],
      ['usr_instructor', 'instructor@yoveacademy.com', demoHash, 'INSTRUCTOR', 'Prof. Mario Rossi (Máster en Redes CAN)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 'Chile', 'Laboratorio Rossi', 12100, 'Especialista', 28, 210, 'pro', now, now],
      ['usr_student', 'estudiante@yoveacademy.com', demoHash, 'STUDENT', 'Alex Vega (Estudiante Diagnosta)', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 'Colombia', 'Taller Vega', 2850, 'Técnico', 12, 42, 'free', now, now],
      ['usr_moderator', 'moderador@yoveacademy.com', demoHash, 'MODERATOR', 'Sofía Valenzuela (Moderadora)', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300', 'Argentina', 'YOVE Community', 6400, 'Diagnosta', 19, 95, 'pro', now, now]
    ];

    for (const u of defaultUsers) {
      insertUser.run(...u);
    }
  }

  // Seed sample cases if empty
  const caseCountStmt = db.prepare('SELECT COUNT(*) as count FROM diagnostic_cases');
  const caseCount = (caseCountStmt.get() as any).count;
  if (caseCount === 0) {
    const insertCase = db.prepare(`
      INSERT INTO diagnostic_cases (id, title, vehicle, symptom, dtc, difficulty, hints_json, solution, xp_reward)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertCase.run(
      'case-1',
      'P0171 - Sistema demasiado pobre en Toyota Corolla 1.8L',
      'Toyota Corolla 2018 1.8L',
      'Ralentí inestable, código P0171 almacenado, pérdida de potencia en aceleración.',
      'P0171',
      'Intermedio',
      JSON.stringify(['Revisar ajustes de combustible STFT y LTFT', 'Inspeccionar mangueras de vacío del múltiple']),
      'Fuga de vacío en manguera PCV y empaque de múltiple de admisión deteriorado.',
      150
    );
    insertCase.run(
      'case-2',
      'P0300 - Fallas múltiples de encendido en Ford F-150',
      'Ford F-150 2020 3.5L EcoBoost',
      'Motor tironea al acelerar a fondo, luz Check Engine parpadeante.',
      'P0300',
      'Avanzado',
      JSON.stringify(['Ver gráficos de modo 6 en escáner', 'Revisar estado de bujías y bobinas COP']),
      'Bobina de encendido defectuosa en cilindro 4 con resistencia secundaria fuera de rango y bujía con luz excesiva.',
      250
    );
  }

  // Seed notifications if empty
  const notifCountStmt = db.prepare('SELECT COUNT(*) as count FROM notifications');
  const notifCount = (notifCountStmt.get() as any).count;
  if (notifCount === 0) {
    const insertNotif = db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, read, created_at, metadata_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const initialNotifs = [
      ['notif_1', 'usr_student', 'Sistema', '¡Bienvenido a YOVE Academy 3.0!', 'Tu cuenta ha sido activada con nivel Técnico Diagnostica y +2,850 XP.', 0, new Date(Date.now() - 3600000).toISOString(), null],
      ['notif_2', 'usr_student', 'Certificado', 'Certificado Emitido', 'Tu certificado "YOVE-2026-8849" por Redes CAN Bus ya está disponible para descarga.', 0, new Date(Date.now() - 86400000).toISOString(), JSON.stringify({ certId: 'cert_1' })],
      ['notif_3', 'usr_student', 'Community', 'Nueva Respuesta en Foro', 'El Prof. Mario Rossi respondió a tu consulta sobre P0171.', 1, new Date(Date.now() - 172800000).toISOString(), JSON.stringify({ postId: 'post_1' })],
      ['notif_4', 'usr_student', 'Curso', 'Nuevo Curso Publicado', 'Se ha añadido "Osciloscopio Automotriz Avanzado" a tu catálogo.', 0, new Date(Date.now() - 250000000).toISOString(), JSON.stringify({ courseId: 'course_osc' })],
      ['notif_5', 'usr_student', 'Examen', 'Examen Aprobado con Éxito', 'Calificación: 95/100 en Evaluaciones de Inyección Electrónica.', 0, new Date(Date.now() - 300000000).toISOString(), JSON.stringify({ examId: 'exam_inj' })],
      ['notif_6', 'usr_student', 'Suscripción', 'Actualización de Membresía', 'Tu plan Pro se encuentra activo y verificado.', 1, new Date(Date.now() - 400000000).toISOString(), JSON.stringify({ tier: 'pro' })],
      ['notif_7', 'usr_student', 'YOVE AI', 'Consulta Analizada', 'YOVE AI ha generado un árbol de decisión para tu caso DTC P0300.', 1, new Date(Date.now() - 500000000).toISOString(), JSON.stringify({ queryId: 'ai_1' })],
      ['notif_8', 'usr_student', 'Lab', 'Simulación de Laboratorio', 'Completaste con éxito la práctica de sensores inductivos.', 1, new Date(Date.now() - 600000000).toISOString(), JSON.stringify({ labId: 'lab_1' })],
      ['notif_9', 'usr_student', 'Case', 'Solución de Caso Aceptada', 'Tu diagnóstico del caso Ford F-150 fue validado por el comité técnico.', 0, new Date(Date.now() - 700000000).toISOString(), JSON.stringify({ caseId: 'case_2' })],
      ['notif_10', 'usr_student', 'Progreso', 'Meta Semanal Alcanzada', '¡Alcanzaste 5 horas de estudio esta semana!', 1, new Date(Date.now() - 800000000).toISOString(), JSON.stringify({ hours: 5 })]
    ];
    for (const n of initialNotifs) {
      insertNotif.run(...n);
    }
  }
}

export function performDatabaseBackup(): string {
  const dataDir = path.join(process.cwd(), 'data');
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'yove_academy.db');
  if (!fs.existsSync(dbPath)) {
    throw new Error('Database file does not exist to backup');
  }

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `yove_academy_${dateStr}.db`);

  fs.copyFileSync(dbPath, backupPath);

  // Clean up backups keeping last 30 files
  const backupFiles = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('yove_academy_') && f.endsWith('.db'))
    .sort()
    .reverse();

  if (backupFiles.length > 30) {
    for (let i = 30; i < backupFiles.length; i++) {
      try {
        fs.unlinkSync(path.join(backupDir, backupFiles[i]));
      } catch (err) {
        console.error('Failed to clean old backup file:', err);
      }
    }
  }

  console.log(`[Database Backup] Automated backup created: ${backupPath}`);
  return backupPath;
}


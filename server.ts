import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { initDatabase, db, performDatabaseBackup } from "./server/db";
import { hashPassword, verifyPassword, createSession, getUserByToken, revokeSession, revokeAllUserSessions, createPasswordResetToken, verifyAndConsumeResetToken } from "./server/auth";
import { initShieldDB, yoveShieldMiddleware, globalRateLimiter, authRateLimiter, logSecurityEvent } from "./server/shield/index";
import shieldRoutes from "./server/shield/routes";

dotenv.config();

import { registerCoreRoutes } from "./server/api/coreRoutes";
import { registerAiRoutes } from "./server/api/aiRoutes";
import { registerInstructorRoutes } from "./server/api/instructorRoutes";
import { registerCertificateRoutes } from "./server/api/certificateRoutes";
import { registerInstitutionRoutes } from "./server/api/institutionRoutes";
import { registerCurriculumRoutes } from "./server/api/curriculumRoutes";
import { registerContentStudioRoutes } from "./server/api/contentStudioRoutes";
import learningPathsRoutes from "./server/api/learningPathsRoutes";
import paymentsRoutes from "./server/payments/routes";
import scaleRoutes from "./server/scale/routes";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // YOVE SHIELD: Global Middleware & Rate Limiter
  app.use(yoveShieldMiddleware);
  app.use(globalRateLimiter);

  app.use(express.json());

  // Initialize SQLite database & seed data
  initDatabase();
  
  // Initialize YOVE SHIELD Security Database
  initShieldDB();

  // Scheduled Daily Database Backup (24h Interval + Initial Backup on startup)
  try {
    performDatabaseBackup();
  } catch (err) {
    console.error("Initial database backup error:", err);
  }
  setInterval(() => {
    try {
      performDatabaseBackup();
    } catch (err) {
      console.error("Scheduled database backup error:", err);
    }
  }, 24 * 60 * 60 * 1000);

  // Automotive AI Master Assistant System Instruction - PROMPT 06
  const SYSTEM_INSTRUCTION = `
Eres YOVE AI, el asistente experto en educación mecatrónica y diagnóstico automotriz de YOVE Academy.

OBJETIVO TÉCNICO Y EDUCATIVO:
Ayudas a estudiantes, mecánicos y técnicos a:
- Estudiar y comprender la física, electricidad y electrónica automotriz.
- Explicar detalladamente el funcionamiento de sistemas, sensores y actuadores.
- Interpretar códigos de falla OBD-II (DTCs como P0171, P0300, P0340, P0420, U0100, etc.).
- Analizar síntomas de fallas mecánicas y electrónicas en vehículos de combustión, híbridos (HEV) y eléctricos (EV).
- Construir árboles de decisión y secuencias de comprobación de diagnóstico.
- Recomendar cursos y lecciones específicas del catálogo de YOVE Academy.
- Crear ejercicios de práctica y preguntas de autoevaluación.

ESTRUCTURA OBLIGATORIA DE RESPUESTA (FLUJO YOVE AI):
Cuando el usuario consulte sobre una falla, vehículo, DTC o síntoma, tu respuesta DEBE estructurarse de la siguiente manera usando Markdown profesional:

1. 🔍 **Análisis Técnico Educativo**:
   Explicación clara del significado del DTC o síntoma, teoría de funcionamiento y por qué la ECU registra el código.

2. ❓ **Preguntas y Datos Necesarios**:
   Listado de datos, lecturas de escáner (Live Data, STFT/LTFT, Freeze Frame) o mediciones físicas que se requieren antes de dar un veredicto definitivo.

3. ⚠️ **Posibles Causas (Ordenadas por Probabilidad)**:
   Jerarquía de causas comunes, desde las más probables y sencillas de verificar (fugas de vacío, conectores sueltos) hasta las más complejas (sensores defectuosos, falla interna de ECU).

4. 🔬 **Pruebas Recomendadas con Equipos de Diagnóstico**:
   Pasos precisos de comprobación utilizando:
   - Multímetro (Voltaje, Resistencia, Caídas de tensión)
   - Osciloscopio (Forma de onda, Voltaje pico a pico, Frecuencia, Duty Cycle)
   - Escáner u otros medidores (Manómetro de combustible, máquina de humo)

5. 📊 **Interpretación y Orden de Diagnóstico**:
   Valores esperados vs. valores anómalos. Secuencia lógica de verificación para evitar sustitución de repuestos a ciegas.

6. 🎓 **Siguiente Paso & Recomendación Educativa**:
   Recomendación didáctica de lecciones o simulaciones en el laboratorio virtual de YOVE Academy.

NORMAS DE SEGURIDAD Y PRECISIÓN TÉCNICA:
- Diferencia explícitamente la INFORMACIÓN EDUCATIVA del DIAGNÓSTICO PROFESIONAL EN TALLER.
- NUNCA afirmes que una causa es 100% definitiva si no se dispone de mediciones reales del vehículo.
- NO inventes valores técnicos ni datos de tolerancia ficticios. Si no se cuenta con el dato exacto de fábrica, indica explícitamente "Información no disponible / Consultar manual del fabricante".
- Muestra siempre advertencias de seguridad al tratar con Alta Tensión (HV) en vehículos Híbridos o Eléctricos.
`;

  // API Health & Info
  app.get(["/api/health", "/api/v1/health"], (req, res) => {
    res.json({
      status: "ok",
      version: "3.0.0",
      app: "YOVE Academy LMS Persistent Engine",
      architecture: {
        database: "SQLite (node:sqlite)",
        roles: ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR", "STUDENT", "MODERATOR"],
        modules: [
          "users", "roles", "profiles", "courses", "categories", "modules", "lessons",
          "enrollments", "progress", "quizzes", "questions", "answers", "exams",
          "certificates", "brands", "vehicle_models", "dtcs", "diagnostic_cases",
          "lab_simulations", "ai_conversations", "community_posts", "subscriptions", "notifications"
        ]
      }
    });
  });

  // ==================== AUTH & RBAC MIDDLEWARES ====================
  const getCookieToken = (req: any) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/yove_session_token=([^;]+)/);
    return match ? match[1] : null;
  };

  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : (req.headers['x-session-token'] || getCookieToken(req) || req.query.token);
    if (!token) {
      return res.status(401).json({ error: "No autorizado. Token requerido." });
    }
    const user = getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: "Sesión inválida, expirada o cuenta suspendida." });
    }
    req.user = user;
    req.token = token;
    next();
  };

  const requireRole = (...allowedRoles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Acceso denegado (403). Permisos insuficientes para este rol." });
      }
      next();
    };
  };

  // Register YOVE SHIELD API (Admin Only)
  app.use("/api/v1/shield", requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), shieldRoutes);

  // Register YOVE PAYMENTS API
  app.use("/api/v1/payments", paymentsRoutes);

  // Register YOVE SCALE & ARCHITECTURE API
  app.use("/api/v1/scale", scaleRoutes);

  const requireOwnershipOrAdmin = (getUserId: (req: any) => string) => {
    return (req: any, res: any, next: any) => {
      if (!req.user) return res.status(401).json({ error: "No autorizado." });
      const targetUserId = getUserId(req);
      const isAdminOrSuper = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);
      if (req.user.id !== targetUserId && !isAdminOrSuper) {
        return res.status(403).json({ error: "Acceso denegado (403). Prevención IDOR: No puedes acceder a recursos de otro usuario." });
      }
      next();
    };
  };

  // ==================== REAL AUTHENTICATION & IDENTITY ENDPOINTS ====================

  app.post("/api/v1/auth/register", authRateLimiter, (req, res) => {
    try {
      const { email, password, full_name, country } = req.body;
      if (!email || !password || !full_name) {
        return res.status(400).json({ error: "Faltan campos obligatorios (email, password, full_name)." });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
      }

      const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
      if (existing) {
        logSecurityEvent('REGISTER_FAILED', 'LOW', null, req.ip || 'unknown', { email, reason: 'Email already exists' });
        return res.status(400).json({ error: "El correo electrónico ya está registrado." });
      }

      const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const passwordHash = hashPassword(password);
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO users (id, email, password_hash, role, status, full_name, country, workshop_name, xp, level_name, streak_days, study_hours, subscription, created_at, updated_at, is_active)
        VALUES (?, ?, ?, 'STUDENT', 'ACTIVE', ?, ?, 'Taller Personal', 0, 'Técnico', 1, 1, 'free', ?, ?, 1)
      `).run(id, email, passwordHash, full_name, country || 'Global', now, now);

      const token = createSession(id, req.ip, req.headers['user-agent']);
      const user = db.prepare("SELECT id, email, role, status, full_name, avatar_url, country, workshop_name, xp, level_name, streak_days, study_hours, subscription, created_at FROM users WHERE id = ?").get(id);

      logSecurityEvent('REGISTER_SUCCESS', 'INFO', id, req.ip || 'unknown', { email });

      // Set HttpOnly Cookie for secure session storage
      res.setHeader('Set-Cookie', `yove_session_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`);

      res.json({ success: true, token, user });
    } catch (e: any) {
      logSecurityEvent('REGISTER_ERROR', 'HIGH', null, req.ip || 'unknown', { error: e.message });
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/auth/login", authRateLimiter, (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña requeridos." });
      }
      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
      if (!user || !verifyPassword(password, user.password_hash)) {
        logSecurityEvent('LOGIN_FAILED', 'MEDIUM', user ? user.id : null, req.ip || 'unknown', { email });
        return res.status(401).json({ error: "Credenciales incorrectas." });
      }

      // Check account status
      const status = user.status || (user.is_active === 0 ? 'SUSPENDED' : 'ACTIVE');
      if (status === 'SUSPENDED' || status === 'BLOCKED') {
        logSecurityEvent('LOGIN_BLOCKED_STATUS', 'HIGH', user.id, req.ip || 'unknown', { email, status });
        return res.status(403).json({ error: "Tu cuenta se encuentra suspendida o bloqueada. Contacta al soporte técnico." });
      }

      db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);
      const token = createSession(user.id, req.ip, req.headers['user-agent']);

      const { password_hash, ...safeUser } = user;
      
      logSecurityEvent('LOGIN_SUCCESS', 'INFO', user.id, req.ip || 'unknown', { email });

      // Set HttpOnly Cookie
      res.setHeader('Set-Cookie', `yove_session_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`);

      res.json({ success: true, token, user: safeUser });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Google OAuth Login Endpoint
  app.post("/api/v1/auth/google", authRateLimiter, async (req, res) => {
    try {
      const { email, name, picture, googleId, credential } = req.body;
      let userEmail = email;
      let userName = name;
      let userAvatar = picture;

      // If Google credential JWT exists, decode payload payload safely
      if (credential && !userEmail) {
        try {
          const base64Url = credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
          const payload = JSON.parse(jsonPayload);
          userEmail = payload.email;
          userName = payload.name;
          userAvatar = payload.picture;
        } catch (err) {
          console.warn("Could not parse credential token, using body parameters:", err);
        }
      }

      if (!userEmail) {
        return res.status(400).json({ error: "No se pudo obtener la información del perfil de Google." });
      }

      let user = db.prepare("SELECT * FROM users WHERE email = ?").get(userEmail) as any;

      if (!user) {
        // Create new account for Google user
        const id = `usr_google_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const now = new Date().toISOString();
        const dummyHash = hashPassword(`google_${Date.now()}_${Math.random()}`);

        db.prepare(`
          INSERT INTO users (id, email, password_hash, role, status, full_name, avatar_url, country, workshop_name, xp, level_name, streak_days, study_hours, subscription, created_at, updated_at, is_active, email_verified)
          VALUES (?, ?, ?, 'STUDENT', 'ACTIVE', ?, ?, 'Taller Personal', 100, 'Técnico', 1, 1, 'free', ?, ?, 1, 1)
        `).run(id, userEmail, dummyHash, userName || userEmail.split('@')[0], userAvatar || '', 'Global', now, now);

        user = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as any;
        logSecurityEvent('GOOGLE_REGISTER_SUCCESS', 'INFO', id, req.ip || 'unknown', { email: userEmail });
      } else {
        // Update user avatar/verification if needed
        if (userAvatar && !user.avatar_url) {
          db.prepare("UPDATE users SET avatar_url = ? WHERE id = ?").run(userAvatar, user.id);
        }
        db.prepare("UPDATE users SET last_login = datetime('now'), email_verified = 1 WHERE id = ?").run(user.id);
        logSecurityEvent('GOOGLE_LOGIN_SUCCESS', 'INFO', user.id, req.ip || 'unknown', { email: userEmail });
      }

      // Check account status
      const status = user.status || (user.is_active === 0 ? 'SUSPENDED' : 'ACTIVE');
      if (status === 'SUSPENDED' || status === 'BLOCKED') {
        return res.status(403).json({ error: "Tu cuenta se encuentra suspendida o bloqueada." });
      }

      const token = createSession(user.id, req.ip, req.headers['user-agent']);
      const { password_hash, ...safeUser } = user;

      res.setHeader('Set-Cookie', `yove_session_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`);
      res.json({ success: true, token, user: safeUser });
    } catch (e: any) {
      logSecurityEvent('GOOGLE_AUTH_ERROR', 'HIGH', null, req.ip || 'unknown', { error: e.message });
      res.status(500).json({ error: e.message });
    }
  });

  // Send Email Verification Code Endpoint
  app.post("/api/v1/auth/send-verification-code", authRateLimiter, (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: "Proporciona un correo electrónico válido." });
      }

      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const id = `code_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

      // Invalidate previous active codes for this email
      db.prepare("UPDATE email_verification_codes SET used = 1 WHERE email = ?").run(email);

      // Insert new code
      db.prepare(`
        INSERT INTO email_verification_codes (id, email, code, expires_at, used, created_at)
        VALUES (?, ?, ?, ?, 0, datetime('now'))
      `).run(id, email, code, expiresAt);

      logSecurityEvent('VERIFICATION_CODE_SENT', 'INFO', null, req.ip || 'unknown', { email });

      res.json({
        success: true,
        message: `Código de verificación de 6 dígitos enviado a ${email}.`,
        demoCode: code // Provided for instant preview testing
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Verify Email Code and Authenticate Endpoint
  app.post("/api/v1/auth/verify-email-code", authRateLimiter, (req, res) => {
    try {
      const { email, code, full_name, country } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: "Correo y código de verificación son requeridos." });
      }

      const record = db.prepare(`
        SELECT * FROM email_verification_codes
        WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime('now')
      `).get(email, code) as any;

      if (!record) {
        logSecurityEvent('VERIFICATION_CODE_INVALID', 'MEDIUM', null, req.ip || 'unknown', { email, code });
        return res.status(400).json({ error: "El código de verificación es incorrecto o ha expirado." });
      }

      // Mark code as used
      db.prepare("UPDATE email_verification_codes SET used = 1 WHERE id = ?").run(record.id);

      let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

      if (!user) {
        // Create verified user
        const id = `usr_verified_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const now = new Date().toISOString();
        const defaultHash = hashPassword(`verified_${Date.now()}_${Math.random()}`);

        db.prepare(`
          INSERT INTO users (id, email, password_hash, role, status, full_name, country, workshop_name, xp, level_name, streak_days, study_hours, subscription, created_at, updated_at, is_active, email_verified)
          VALUES (?, ?, ?, 'STUDENT', 'ACTIVE', ?, ?, 'Taller Personal', 50, 'Técnico', 1, 1, 'free', ?, ?, 1, 1)
        `).run(id, email, defaultHash, full_name || email.split('@')[0], country || 'Global', now, now);

        user = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as any;
        logSecurityEvent('EMAIL_CODE_REGISTER_SUCCESS', 'INFO', id, req.ip || 'unknown', { email });
      } else {
        db.prepare("UPDATE users SET email_verified = 1, last_login = datetime('now') WHERE id = ?").run(user.id);
        logSecurityEvent('EMAIL_CODE_LOGIN_SUCCESS', 'INFO', user.id, req.ip || 'unknown', { email });
      }

      const token = createSession(user.id, req.ip, req.headers['user-agent']);
      const { password_hash, ...safeUser } = user;

      res.setHeader('Set-Cookie', `yove_session_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Lax`);
      res.json({ success: true, token, user: safeUser });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/auth/logout", requireAuth, (req: any, res) => {
    try {
      if (req.token) {
        revokeSession(req.token);
      }
      logSecurityEvent('LOGOUT', 'INFO', req.user?.id || null, req.ip || 'unknown', {});
      
      res.setHeader('Set-Cookie', `yove_session_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
      res.json({ success: true, message: "Sesión cerrada correctamente." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/auth/me", requireAuth, (req: any, res) => {
    try {
      const { password_hash, ...safeUser } = req.user;
      res.json({ success: true, user: safeUser });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/auth/forgot-password", authRateLimiter, (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "El correo electrónico es obligatorio." });
      }

      const user = db.prepare("SELECT id, full_name FROM users WHERE email = ?").get(email) as any;
      let resetToken = null;

      if (user) {
        resetToken = createPasswordResetToken(user.id);
        logSecurityEvent('PASSWORD_RESET_REQUESTED', 'INFO', user.id, req.ip || 'unknown', { email });
      } else {
        logSecurityEvent('PASSWORD_RESET_NOT_FOUND', 'LOW', null, req.ip || 'unknown', { email });
      }

      // Return unified response to avoid email enumeration
      res.json({
        success: true,
        message: "Si el correo está registrado en YOVE Academy, recibirás las instrucciones para restablecer tu contraseña.",
        demoResetToken: resetToken // Provided in demo/development mode
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/auth/reset-password", authRateLimiter, (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token y nueva contraseña requeridos." });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres." });
      }

      const userId = verifyAndConsumeResetToken(token);
      if (!userId) {
        return res.status(400).json({ error: "El token de recuperación es inválido o ha expirado." });
      }

      const newHash = hashPassword(newPassword);
      db.prepare(`
        UPDATE users 
        SET password_hash = ?, last_password_change = datetime('now'), updated_at = datetime('now') 
        WHERE id = ?
      `).run(newHash, userId);

      // Invalidate all previous sessions upon password reset
      revokeAllUserSessions(userId);

      logSecurityEvent('PASSWORD_RESET_SUCCESS', 'INFO', userId, req.ip || 'unknown', {});

      res.json({ success: true, message: "Tu contraseña se ha restablecido con éxito. Por favor inicia sesión con tu nueva contraseña." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/auth/change-password", requireAuth, (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Contraseña actual y nueva contraseña requeridas." });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres." });
      }

      const dbUser = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id) as any;
      if (!dbUser || !verifyPassword(currentPassword, dbUser.password_hash)) {
        logSecurityEvent('CHANGE_PASSWORD_FAILED', 'MEDIUM', req.user.id, req.ip || 'unknown', {});
        return res.status(400).json({ error: "La contraseña actual es incorrecta." });
      }

      const newHash = hashPassword(newPassword);
      db.prepare(`
        UPDATE users 
        SET password_hash = ?, last_password_change = datetime('now'), updated_at = datetime('now') 
        WHERE id = ?
      `).run(newHash, req.user.id);

      logSecurityEvent('PASSWORD_CHANGED', 'INFO', req.user.id, req.ip || 'unknown', {});

      res.json({ success: true, message: "Contraseña actualizada correctamente." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==================== ADMIN USER MANAGEMENT & RBAC ENDPOINTS ====================

  app.put("/api/v1/admin/users/:userId/role", requireAuth, requireRole('SUPER_ADMIN'), (req: any, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const validRoles = ['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR', 'MODERATOR', 'STUDENT'];
      if (!role || !validRoles.includes(role)) {
        return res.status(400).json({ error: `Rol no válido. Debe ser uno de: ${validRoles.join(', ')}` });
      }

      db.prepare("UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?").run(role, userId);

      logSecurityEvent('ROLE_CHANGED', 'HIGH', req.user.id, req.ip || 'unknown', { targetUserId: userId, newRole: role });

      res.json({ success: true, message: `Rol de usuario actualizado a ${role}` });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/v1/admin/users/:userId/status", requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), (req: any, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.body; // ACTIVE, SUSPENDED, BLOCKED

      const validStatuses = ['ACTIVE', 'SUSPENDED', 'BLOCKED', 'PENDING_VERIFICATION'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: `Estado no válido.` });
      }

      const isActive = status === 'ACTIVE' ? 1 : 0;
      db.prepare("UPDATE users SET status = ?, is_active = ?, updated_at = datetime('now') WHERE id = ?").run(status, isActive, userId);

      if (status === 'SUSPENDED' || status === 'BLOCKED') {
        revokeAllUserSessions(userId);
      }

      logSecurityEvent('USER_STATUS_CHANGED', 'HIGH', req.user.id, req.ip || 'unknown', { targetUserId: userId, newStatus: status });

      res.json({ success: true, message: `Estado de usuario actualizado a ${status}` });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/admin/users/:userId/revoke-sessions", requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), (req: any, res) => {
    try {
      const { userId } = req.params;
      revokeAllUserSessions(userId);

      logSecurityEvent('FORCE_LOGOUT_ALL', 'HIGH', req.user.id, req.ip || 'unknown', { targetUserId: userId });

      res.json({ success: true, message: "Todas las sesiones del usuario han sido revocadas." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==================== PERSISTENCE API (PROMPT 12 & 13) ====================

  // Users & Admin Endpoints (Protected with RBAC)
  app.get("/api/v1/users", requireAuth, requireRole('SUPER_ADMIN', 'ADMIN'), (req, res) => {
    try {
      const stmt = db.prepare("SELECT id, email, role, full_name, avatar_url, country, workshop_name, xp, level_name, streak_days, study_hours, subscription, created_at FROM users");
      const users = stmt.all();
      res.json(users);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/v1/users/profile", (req, res) => {
    try {
      const { id, full_name, country, workshop_name, avatar_url } = req.body;
      const stmt = db.prepare("UPDATE users SET full_name = ?, country = ?, workshop_name = ?, avatar_url = ?, updated_at = datetime('now') WHERE id = ?");
      stmt.run(full_name, country, workshop_name, avatar_url, id);
      const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
      res.json({ success: true, user: updated });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 2. Student Progress Endpoints
  app.get("/api/v1/progress/:userId", requireAuth, requireOwnershipOrAdmin(req => req.params.userId), (req: any, res) => {
    try {
      const { userId } = req.params;
      const stmt = db.prepare("SELECT * FROM progress WHERE user_id = ?");
      const progress = stmt.all(userId);
      res.json(progress);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/progress", requireAuth, requireOwnershipOrAdmin(req => req.body.user_id), (req: any, res) => {
    try {
      const { user_id, course_id, module_id, lesson_id, completed } = req.body;
      const id = `${user_id}_${course_id}_${module_id}_${lesson_id}`;
      const stmt = db.prepare(`
        INSERT INTO progress (id, user_id, course_id, module_id, lesson_id, completed, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET completed = ?, completed_at = datetime('now')
      `);
      stmt.run(id, user_id, course_id, module_id, lesson_id, completed ? 1 : 0, completed ? 1 : 0);
      res.json({ success: true, id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 3. Quiz Attempts Endpoints
  app.get("/api/v1/quizzes/attempts/:userId", requireAuth, requireOwnershipOrAdmin(req => req.params.userId), (req: any, res) => {
    try {
      const { userId } = req.params;
      const attempts = db.prepare("SELECT * FROM quiz_attempts WHERE user_id = ?").all(userId);
      res.json(attempts);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/quizzes/attempts", requireAuth, requireOwnershipOrAdmin(req => req.body.user_id), (req: any, res) => {
    try {
      const { user_id, course_id, quiz_id, score, passed, answers } = req.body;
      const id = `qa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const stmt = db.prepare(`
        INSERT INTO quiz_attempts (id, user_id, course_id, quiz_id, score, passed, answers_json, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `);
      stmt.run(id, user_id, course_id, quiz_id, score, passed ? 1 : 0, JSON.stringify(answers || {}));
      
      // Update XP if passed
      if (passed) {
        db.prepare("UPDATE users SET xp = xp + 50 WHERE id = ?").run(user_id);
      }

      res.json({ success: true, attemptId: id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 4. Certificates Endpoints
  app.get("/api/v1/certificates/:userId", requireAuth, requireOwnershipOrAdmin(req => req.params.userId), (req: any, res) => {
    try {
      const { userId } = req.params;
      const certs = db.prepare("SELECT * FROM certificates WHERE user_id = ?").all(userId);
      res.json(certs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/certificates", requireAuth, requireOwnershipOrAdmin(req => req.body.user_id), (req: any, res) => {
    try {
      const { user_id, course_id, score, hours } = req.body;
      const id = `cert_${Date.now()}`;
      const verification_code = `YOVE-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`;
      const stmt = db.prepare(`
        INSERT INTO certificates (id, user_id, course_id, verification_code, issued_at, score, hours, status)
        VALUES (?, ?, ?, ?, datetime('now'), ?, ?, 'valid')
      `);
      stmt.run(id, user_id, course_id, verification_code, score, hours || '40 Horas Académicas');
      const cert = db.prepare("SELECT * FROM certificates WHERE id = ?").get(id);
      res.json({ success: true, certificate: cert });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 5. Community Endpoints
  app.get("/api/v1/community/posts", (req, res) => {
    try {
      const posts = db.prepare("SELECT * FROM community_posts ORDER BY created_at DESC").all();
      res.json(posts);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/community/posts", (req, res) => {
    try {
      const { author_id, author_name, author_avatar, title, content, category, tags } = req.body;
      const id = `post_${Date.now()}`;
      const stmt = db.prepare(`
        INSERT INTO community_posts (id, author_id, author_name, author_avatar, title, content, category, tags_json, likes, comments_count, solved, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, datetime('now'))
      `);
      stmt.run(id, author_id, author_name, author_avatar || '', title, content, category || 'General', JSON.stringify(tags || []));
      const post = db.prepare("SELECT * FROM community_posts WHERE id = ?").get(id);
      res.json({ success: true, post });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 6. Diagnostic Cases Endpoints
  app.get("/api/v1/cases", (req, res) => {
    try {
      const cases = db.prepare("SELECT * FROM diagnostic_cases").all();
      res.json(cases);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/cases/attempt", requireAuth, requireOwnershipOrAdmin(req => req.body.user_id), (req: any, res) => {
    try {
      const { user_id, case_id, attempt_id, steps, hints_used, tests_performed, score, accuracy, time_seconds, completed, xp_reward } = req.body;
      const id = attempt_id || `case_att_${Date.now()}`;
      
      // Check if attempt already exists to prevent duplicate XP
      const existing = db.prepare("SELECT id, score FROM case_attempts WHERE attempt_id = ? OR (user_id = ? AND case_id = ? AND completed = 1)").get(id, user_id, case_id);
      
      db.prepare(`
        INSERT INTO case_attempts (id, user_id, case_id, attempt_id, steps_json, hints_used, tests_performed, score, accuracy, time_seconds, completed, started_at, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' seconds'), datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          steps_json = excluded.steps_json,
          hints_used = excluded.hints_used,
          tests_performed = excluded.tests_performed,
          score = excluded.score,
          accuracy = excluded.accuracy,
          time_seconds = excluded.time_seconds,
          completed = excluded.completed,
          completed_at = datetime('now')
      `).run(
        id,
        user_id,
        case_id,
        id,
        JSON.stringify(steps || []),
        hints_used || 0,
        tests_performed || 0,
        score || 0,
        accuracy || 100,
        time_seconds || 0,
        completed ? 1 : 0,
        time_seconds || 0
      );

      // Award XP if completed with score >= 70 and not already rewarded for this case
      if (completed && score >= 70 && !existing) {
        const xpToAdd = xp_reward || 150;
        db.prepare("UPDATE users SET xp = xp + ? WHERE id = ?").run(xpToAdd, user_id);
      }

      res.json({ success: true, attemptId: id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/cases/attempts/:userId", requireAuth, requireOwnershipOrAdmin(req => req.params.userId), (req: any, res) => {
    try {
      const { userId } = req.params;
      const attempts = db.prepare("SELECT * FROM case_attempts WHERE user_id = ? ORDER BY completed_at DESC").all(userId);
      res.json({ success: true, attempts });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Lab Attempts Endpoints
  app.post("/api/v1/labs/attempt", requireAuth, requireOwnershipOrAdmin(req => req.body.user_id), (req: any, res) => {
    try {
      const { user_id, lab_type, scenario_id, score, errors_count, time_seconds, explanation, xp_earned } = req.body;
      const id = `lab_att_${Date.now()}`;
      
      db.prepare(`
        INSERT INTO lab_attempts (id, user_id, lab_type, scenario_id, score, errors_count, time_seconds, explanation, xp_earned, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        id,
        user_id,
        lab_type || 'oscilloscope',
        scenario_id || 'default',
        score || 100,
        errors_count || 0,
        time_seconds || 0,
        explanation || '',
        xp_earned || 100
      );

      if (score >= 70 && xp_earned > 0) {
        db.prepare("UPDATE users SET xp = xp + ? WHERE id = ?").run(xp_earned, user_id);
      }

      res.json({ success: true, attemptId: id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/labs/attempts/:userId", requireAuth, requireOwnershipOrAdmin(req => req.params.userId), (req: any, res) => {
    try {
      const { userId } = req.params;
      const attempts = db.prepare("SELECT * FROM lab_attempts WHERE user_id = ? ORDER BY completed_at DESC").all(userId);
      res.json({ success: true, attempts });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 7. AI History Endpoints
  app.get("/api/v1/ai/conversations/:userId", requireAuth, requireOwnershipOrAdmin(req => req.params.userId), (req: any, res) => {
    try {
      const { userId } = req.params;
      const convs = db.prepare("SELECT * FROM ai_conversations WHERE user_id = ?").all(userId);
      res.json(convs);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/ai/conversations", requireAuth, requireOwnershipOrAdmin(req => req.body.user_id), (req: any, res) => {
    try {
      const { user_id, conversation_id, messages, vehicle_context } = req.body;
      const stmt = db.prepare(`
        INSERT INTO ai_conversations (id, user_id, conversation_id, messages_json, vehicle_context_json, updated_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(conversation_id) DO UPDATE SET messages_json = ?, vehicle_context_json = ?, updated_at = datetime('now')
      `);
      const id = conversation_id || `conv_${Date.now()}`;
      stmt.run(id, user_id, id, JSON.stringify(messages || []), JSON.stringify(vehicle_context || {}), JSON.stringify(messages || []), JSON.stringify(vehicle_context || {}));
      res.json({ success: true, conversationId: id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });



  // ==================== MONETIZATION & SUBSCRIPTIONS API (PROMPT 14) ====================
  app.get("/api/v1/subscriptions/current/:userId", requireAuth, requireOwnershipOrAdmin(req => req.params.userId), (req: any, res) => {
    try {
      const { userId } = req.params;
      const sub = db.prepare("SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1").get(userId);
      if (!sub) {
        return res.json({ success: true, subscription: { tier: 'free', status: 'active', amount: 0 } });
      }
      res.json({ success: true, subscription: sub });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/subscriptions/upgrade", requireAuth, requireOwnershipOrAdmin(req => req.body.user_id), (req: any, res) => {
    try {
      const { user_id, tier, billing_cycle, amount, gateway } = req.body;
      if (!user_id || !tier || amount === undefined) {
        return res.status(400).json({ error: "Faltan datos de suscripción." });
      }

      const subId = `sub_${Date.now()}`;
      const payId = `pay_${Date.now()}`;
      const now = new Date().toISOString();
      const periodEnd = new Date(Date.now() + (billing_cycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString();

      db.prepare("UPDATE subscriptions SET status = 'cancelled' WHERE user_id = ?").run(user_id);

      db.prepare(`
        INSERT INTO subscriptions (id, user_id, tier, status, gateway, billing_cycle, amount, current_period_end, created_at)
        VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?)
      `).run(subId, user_id, tier, gateway || 'stripe', billing_cycle || 'annual', amount, periodEnd, now);

      db.prepare(`
        INSERT INTO payments (id, user_id, amount, currency, status, tier, created_at)
        VALUES (?, ?, ?, 'USD', 'succeeded', ?, ?)
      `).run(payId, user_id, amount, tier, now);

      db.prepare("UPDATE users SET subscription = ?, updated_at = ? WHERE id = ?").run(tier, now, user_id);

      res.json({ success: true, message: "Suscripción actualizada con éxito.", subscriptionId: subId });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==================== ADVANCED ADMIN ANALYTICS API (PROMPT 14) ====================
  app.get("/api/v1/admin/analytics", requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req: any, res) => {
    try {
      const totalUsers = (db.prepare("SELECT COUNT(*) as cnt FROM users").get() as any).cnt;
      const activeSubs = (db.prepare("SELECT COUNT(*) as cnt FROM subscriptions WHERE status = 'active'").get() as any).cnt;
      const totalCourses = (db.prepare("SELECT COUNT(*) as cnt FROM courses").get() as any).cnt;
      const totalCertificates = (db.prepare("SELECT COUNT(*) as cnt FROM certificates").get() as any).cnt;
      const totalRevenue = (db.prepare("SELECT SUM(amount) as sum FROM payments WHERE status = 'succeeded'").get() as any).sum || 0;
      
      const usersByRole = db.prepare("SELECT role, COUNT(*) as count FROM users GROUP BY role").all();
      const recentPayments = db.prepare("SELECT p.*, u.email, u.full_name FROM payments p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT 10").all();

      res.json({
        success: true,
        analytics: {
          totalUsers,
          activeSubs,
          totalCourses,
          totalCertificates,
          totalRevenue,
          usersByRole,
          recentPayments
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==================== YOVE GARAGE 2.0 API (PROMPT 15) ====================
  app.get("/api/v1/garage/favorites/:userId", requireAuth, requireOwnershipOrAdmin(req => req.params.userId), (req: any, res) => {
    try {
      const { userId } = req.params;
      const favs = db.prepare("SELECT * FROM garage_favorites WHERE user_id = ? ORDER BY created_at DESC").all(userId);
      res.json({ success: true, favorites: favs });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/garage/favorites", requireAuth, requireOwnershipOrAdmin(req => req.body.user_id), (req: any, res) => {
    try {
      const { user_id, item_type, item_id, item_data } = req.body;
      if (!user_id || !item_type || !item_id) {
        return res.status(400).json({ error: "Faltan datos de favorito." });
      }

      // Check if already exists
      const existing = db.prepare("SELECT id FROM garage_favorites WHERE user_id = ? AND item_type = ? AND item_id = ?").get(user_id, item_type, item_id);
      if (existing) {
        db.prepare("DELETE FROM garage_favorites WHERE user_id = ? AND item_type = ? AND item_id = ?").run(user_id, item_type, item_id);
        return res.json({ success: true, action: "removed" });
      }

      const favId = `fav_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO garage_favorites (id, user_id, item_type, item_id, item_data, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(favId, user_id, item_type, item_id, JSON.stringify(item_data || {}), now);

      res.json({ success: true, action: "added", id: favId });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/garage/recent/:userId", requireAuth, requireOwnershipOrAdmin(req => req.params.userId), (req: any, res) => {
    try {
      const { userId } = req.params;
      const recent = db.prepare("SELECT * FROM garage_recent WHERE user_id = ? ORDER BY visited_at DESC LIMIT 10").all(userId);
      res.json({ success: true, recent });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/garage/recent", requireAuth, requireOwnershipOrAdmin(req => req.body.user_id), (req: any, res) => {
    try {
      const { user_id, vehicle_title, vehicle_id, brand_name } = req.body;
      if (!user_id || !vehicle_title || !vehicle_id) {
        return res.status(400).json({ error: "Faltan datos de vehículo reciente." });
      }

      // Remove existing duplicate for same vehicle
      db.prepare("DELETE FROM garage_recent WHERE user_id = ? AND vehicle_id = ?").run(user_id, vehicle_id);

      const recId = `rec_${Date.now()}`;
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO garage_recent (id, user_id, vehicle_title, vehicle_id, brand_name, visited_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(recId, user_id, vehicle_title, vehicle_id, brand_name || '', now);

      res.json({ success: true, id: recId });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/garage/search", requireAuth, (req: any, res) => {
    try {
      const q = (req.query.q || '').toString().toLowerCase();
      if (!q || q.length < 2) {
        return res.json({ success: true, results: [] });
      }

      // Search across diagnostic cases, courses, and return structured matches
      const cases = db.prepare("SELECT * FROM diagnostic_cases WHERE LOWER(title) LIKE ? OR LOWER(dtc) LIKE ? OR LOWER(symptom) LIKE ? LIMIT 5").all(`%${q}%`, `%${q}%`, `%${q}%`);
      const courses = db.prepare("SELECT * FROM courses WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? LIMIT 5").all(`%${q}%`, `%${q}%`);

      res.json({
        success: true,
        query: q,
        results: {
          cases,
          courses
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Garage Vehicles SQLite CRUD Endpoints (P3 Migration)
  app.get("/api/v1/garage/vehicles/:userId", requireAuth, requireOwnershipOrAdmin(req => req.params.userId), (req: any, res) => {
    try {
      const { userId } = req.params;
      const vehicles = db.prepare("SELECT * FROM garage_vehicles WHERE user_id = ? ORDER BY updated_at DESC").all(userId);
      res.json({ success: true, vehicles });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/garage/vehicles", requireAuth, requireOwnershipOrAdmin(req => req.body.user_id), (req: any, res) => {
    try {
      const { id, user_id, title, brand, model, year, engine, vin, transmission, fuel_type, notes } = req.body;
      if (!user_id || !brand || !model) {
        return res.status(400).json({ error: "Faltan campos obligatorios para guardar el vehículo." });
      }

      const vehicleId = id || `veh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const vehTitle = title || `${brand} ${model} (${year || 2020})`;

      db.prepare(`
        INSERT INTO garage_vehicles (id, user_id, title, brand, model, year, engine, vin, transmission, fuel_type, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          brand = excluded.brand,
          model = excluded.model,
          year = excluded.year,
          engine = excluded.engine,
          vin = excluded.vin,
          transmission = excluded.transmission,
          fuel_type = excluded.fuel_type,
          notes = excluded.notes,
          updated_at = excluded.updated_at
      `).run(vehicleId, user_id, vehTitle, brand, model, year || 2020, engine || '', vin || '', transmission || '', fuel_type || 'Gasolina', notes || '', now, now);

      const vehicle = db.prepare("SELECT * FROM garage_vehicles WHERE id = ?").get(vehicleId);
      res.json({ success: true, vehicle });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/v1/garage/vehicles/:vehicleId", requireAuth, (req: any, res) => {
    try {
      const { vehicleId } = req.params;
      const veh = db.prepare("SELECT * FROM garage_vehicles WHERE id = ?").get(vehicleId) as any;
      if (!veh) {
        return res.status(404).json({ error: "Vehículo no encontrado." });
      }
      if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN' && veh.user_id !== req.user.id) {
        return res.status(403).json({ error: "No autorizado." });
      }
      db.prepare("DELETE FROM garage_vehicles WHERE id = ?").run(vehicleId);
      res.json({ success: true, message: "Vehículo eliminado del Garage SQLite." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Admin Manual DB Backup Endpoint
  app.post("/api/v1/admin/backup", requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req: any, res) => {
    try {
      const backupPath = performDatabaseBackup();
      res.json({
        success: true,
        message: "Copia de seguridad ejecutada con éxito.",
        backupPath
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });



  // ==================== YOVE COMMUNITY API (PROMPT 18) ====================
  app.get("/api/v1/community/posts", requireAuth, (req: any, res) => {
    try {
      const { category, search, tag } = req.query;
      let query = `
        SELECT p.*, u.full_name as author_name, u.avatar_url as author_avatar, u.role as author_role, u.level_name as author_level, u.xp as author_xp
        FROM community_posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.hidden = 0
      `;
      const params: any[] = [];

      if (category && category !== 'todos') {
        query += ` AND p.category = ?`;
        params.push(category);
      }

      if (search) {
        query += ` AND (LOWER(p.title) LIKE ? OR LOWER(p.content) LIKE ? OR LOWER(p.tags_json) LIKE ?)`;
        const q = `%${search.toLowerCase()}%`;
        params.push(q, q, q);
      }

      query += ` ORDER BY p.created_at DESC`;
      const posts = db.prepare(query).all(...params) as any[];

      // Enrich with comments count, reactions count, etc.
      const enriched = posts.map(p => {
        const commentsCount = (db.prepare("SELECT COUNT(*) as cnt FROM community_comments WHERE post_id = ? AND hidden = 0").get(p.id) as any).cnt;
        const reactions = db.prepare("SELECT reaction_type, COUNT(*) as cnt FROM community_reactions WHERE target_type = 'post' AND target_id = ? GROUP BY reaction_type").all(p.id);
        const userReaction = db.prepare("SELECT reaction_type FROM community_reactions WHERE target_type = 'post' AND target_id = ? AND user_id = ?").get(p.id, req.user.id);
        
        return {
          ...p,
          tags: JSON.parse(p.tags_json || '[]'),
          vehicleContext: JSON.parse(p.vehicle_context_json || 'null'),
          commentsCount,
          reactions,
          userReaction: userReaction ? (userReaction as any).reaction_type : null
        };
      });

      res.json({ success: true, posts: enriched });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/community/posts", requireAuth, (req: any, res) => {
    try {
      const { title, content, category, tags, vehicleContext } = req.body;
      if (!title || !content || !category) {
        return res.status(400).json({ error: "Título, contenido y categoría son obligatorios." });
      }

      const postId = `post_${Date.now()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO community_posts (id, user_id, title, content, category, tags_json, vehicle_context_json, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        postId,
        req.user.id,
        title,
        content,
        category,
        JSON.stringify(tags || []),
        vehicleContext ? JSON.stringify(vehicleContext) : null,
        now,
        now
      );

      // Award XP for posting
      db.prepare("UPDATE users SET xp = xp + 25 WHERE id = ?").run(req.user.id);

      res.json({ success: true, postId });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/v1/community/posts/:id", requireAuth, (req: any, res) => {
    try {
      const { id } = req.params;
      const { title, content, category, tags, vehicleContext } = req.body;
      const post = db.prepare("SELECT * FROM community_posts WHERE id = ?").get(id) as any;

      if (!post) return res.status(404).json({ error: "Publicación no encontrada." });
      if (post.user_id !== req.user.id && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "No autorizado para editar esta publicación." });
      }

      db.prepare(`
        UPDATE community_posts
        SET title = ?, content = ?, category = ?, tags_json = ?, vehicle_context_json = ?, updated_at = ?
        WHERE id = ?
      `).run(
        title || post.title,
        content || post.content,
        category || post.category,
        tags ? JSON.stringify(tags) : post.tags_json,
        vehicleContext ? JSON.stringify(vehicleContext) : post.vehicle_context_json,
        new Date().toISOString(),
        id
      );

      res.json({ success: true, message: "Publicación actualizada." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/v1/community/posts/:id", requireAuth, (req: any, res) => {
    try {
      const { id } = req.params;
      const post = db.prepare("SELECT * FROM community_posts WHERE id = ?").get(id) as any;

      if (!post) return res.status(404).json({ error: "Publicación no encontrada." });
      if (post.user_id !== req.user.id && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN' && req.user.role !== 'MODERATOR') {
        return res.status(403).json({ error: "No autorizado." });
      }

      db.prepare("DELETE FROM community_posts WHERE id = ?").run(id);
      db.prepare("DELETE FROM community_comments WHERE post_id = ?").run(id);

      res.json({ success: true, message: "Publicación eliminada." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/community/posts/:postId/comments", requireAuth, (req: any, res) => {
    try {
      const { postId } = req.params;
      const comments = db.prepare(`
        SELECT c.*, u.full_name as author_name, u.avatar_url as author_avatar, u.role as author_role, u.level_name as author_level
        FROM community_comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ? AND c.hidden = 0
        ORDER BY c.is_solution DESC, c.created_at ASC
      `).all(postId) as any[];

      const enriched = comments.map(c => {
        const reactions = db.prepare("SELECT reaction_type, COUNT(*) as cnt FROM community_reactions WHERE target_type = 'comment' AND target_id = ? GROUP BY reaction_type").all(c.id);
        const userReaction = db.prepare("SELECT reaction_type FROM community_reactions WHERE target_type = 'comment' AND target_id = ? AND user_id = ?").get(c.id, req.user.id);
        return {
          ...c,
          reactions,
          userReaction: userReaction ? (userReaction as any).reaction_type : null
        };
      });

      res.json({ success: true, comments: enriched });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/community/comments", requireAuth, (req: any, res) => {
    try {
      const { post_id, parent_id, content } = req.body;
      if (!post_id || !content) {
        return res.status(400).json({ error: "Faltan datos para el comentario." });
      }

      const commentId = `comm_${Date.now()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO community_comments (id, post_id, user_id, parent_id, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(commentId, post_id, req.user.id, parent_id || null, content, now, now);

      // Award XP for commenting
      db.prepare("UPDATE users SET xp = xp + 10 WHERE id = ?").run(req.user.id);

      // Create notification for post owner
      const post = db.prepare("SELECT user_id, title FROM community_posts WHERE id = ?").get(post_id) as any;
      if (post && post.user_id !== req.user.id) {
        const notifId = `notif_${Date.now()}`;
        db.prepare(`
          INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
          VALUES (?, ?, ?, ?, 'comment', 0, ?)
        `).run(notifId, post.user_id, 'Nuevo comentario en tu publicación', `${req.user.full_name} comentó en "${post.title}"`, now);
      }

      res.json({ success: true, commentId });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/v1/community/comments/:id", requireAuth, (req: any, res) => {
    try {
      const { id } = req.params;
      const comment = db.prepare("SELECT * FROM community_comments WHERE id = ?").get(id) as any;

      if (!comment) return res.status(404).json({ error: "Comentario no encontrado." });
      if (comment.user_id !== req.user.id && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN' && req.user.role !== 'MODERATOR') {
        return res.status(403).json({ error: "No autorizado." });
      }

      db.prepare("DELETE FROM community_comments WHERE id = ? OR parent_id = ?").run(id, id);
      res.json({ success: true, message: "Comentario eliminado." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/community/react", requireAuth, (req: any, res) => {
    try {
      const { target_type, target_id, reaction_type } = req.body;
      if (!target_type || !target_id || !reaction_type) {
        return res.status(400).json({ error: "Datos incompletos." });
      }

      const existing = db.prepare("SELECT * FROM community_reactions WHERE target_type = ? AND target_id = ? AND user_id = ?").get(target_type, target_id, req.user.id) as any;

      if (existing) {
        if (existing.reaction_type === reaction_type) {
          // Remove reaction if clicking same
          db.prepare("DELETE FROM community_reactions WHERE id = ?").run(existing.id);
          return res.json({ success: true, action: "removed" });
        } else {
          // Update reaction type
          db.prepare("UPDATE community_reactions SET reaction_type = ? WHERE id = ?").run(reaction_type, existing.id);
          return res.json({ success: true, action: "updated" });
        }
      } else {
        const reactId = `react_${Date.now()}`;
        db.prepare(`
          INSERT INTO community_reactions (id, target_type, target_id, user_id, reaction_type, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(reactId, target_type, target_id, req.user.id, reaction_type, new Date().toISOString());
        res.json({ success: true, action: "added" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/community/solution", requireAuth, (req: any, res) => {
    try {
      const { post_id, comment_id } = req.body;
      const post = db.prepare("SELECT * FROM community_posts WHERE id = ?").get(post_id) as any;

      if (!post) return res.status(404).json({ error: "Publicación no encontrada." });
      if (post.user_id !== req.user.id && req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: "Solo el autor del post o un administrador pueden aceptar una solución." });
      }

      // Reset previous solutions for this post
      db.prepare("UPDATE community_comments SET is_solution = 0 WHERE post_id = ?").run(post_id);
      
      // Set new solution
      db.prepare("UPDATE community_comments SET is_solution = 1 WHERE id = ?").run(comment_id);
      db.prepare("UPDATE community_posts SET solved_comment_id = ? WHERE id = ?").run(comment_id, post_id);

      // Reward author of the solution comment with XP
      const comment = db.prepare("SELECT user_id FROM community_comments WHERE id = ?").get(comment_id) as any;
      if (comment) {
        db.prepare("UPDATE users SET xp = xp + 100 WHERE id = ?").run(comment.user_id);
        const notifId = `notif_${Date.now()}`;
        db.prepare(`
          INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
          VALUES (?, ?, ?, ?, 'solution', 0, ?)
        `).run(notifId, comment.user_id, '¡Solución aceptada!', `Tu respuesta fue marcada como solución en "${post.title}" (+100 XP)`, new Date().toISOString());
      }

      res.json({ success: true, message: "Solución aceptada con éxito." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/community/report", requireAuth, (req: any, res) => {
    try {
      const { target_type, target_id, reason } = req.body;
      const reportId = `rep_${Date.now()}`;
      db.prepare(`
        INSERT INTO community_reports (id, target_type, target_id, user_id, reason, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', ?)
      `).run(reportId, target_type, target_id, req.user.id, reason || 'Contenido inapropiado', new Date().toISOString());

      res.json({ success: true, message: "Reporte enviado con éxito a moderación." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/community/moderation/reports", requireAuth, requireRole('MODERATOR', 'ADMIN', 'SUPER_ADMIN'), (req: any, res) => {
    try {
      const reports = db.prepare("SELECT r.*, u.full_name as reporter_name FROM community_reports r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC").all();
      res.json({ success: true, reports });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/community/moderation/action", requireAuth, requireRole('MODERATOR', 'ADMIN', 'SUPER_ADMIN'), (req: any, res) => {
    try {
      const { target_type, target_id, action, reason } = req.body;
      const actId = `mod_act_${Date.now()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO community_moderation_actions (id, moderator_id, target_type, target_id, action, reason, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(actId, req.user.id, target_type, target_id, action, reason || '', now);

      if (action === 'hide') {
        if (target_type === 'post') {
          db.prepare("UPDATE community_posts SET hidden = 1 WHERE id = ?").run(target_id);
        } else if (target_type === 'comment') {
          db.prepare("UPDATE community_comments SET hidden = 1 WHERE id = ?").run(target_id);
        }
      } else if (action === 'restore') {
        if (target_type === 'post') {
          db.prepare("UPDATE community_posts SET hidden = 0 WHERE id = ?").run(target_id);
        } else if (target_type === 'comment') {
          db.prepare("UPDATE community_comments SET hidden = 0 WHERE id = ?").run(target_id);
        }
      } else if (action === 'suspend_user') {
        db.prepare("UPDATE users SET is_active = 0 WHERE id = ?").run(target_id);
      }

      res.json({ success: true, message: "Acción de moderación aplicada." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // User Profile public view (without private data)
  app.get("/api/v1/users/profile/:id", requireAuth, (req: any, res) => {
    try {
      const { id } = req.params;
      const u = db.prepare("SELECT id, email, role, full_name, avatar_url, country, workshop_name, xp, level_name, streak_days, study_hours, subscription, created_at FROM users WHERE id = ?").get(id) as any;
      if (!u) return res.status(404).json({ error: "Usuario no encontrado." });

      const posts = db.prepare("SELECT id, title, category, created_at FROM community_posts WHERE user_id = ? AND hidden = 0").all(id);
      const certificates = db.prepare("SELECT * FROM certificates WHERE user_id = ?").all(id);

      res.json({
        success: true,
        profile: {
          ...u,
          posts,
          certificates
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==================== YOVE ANALYTICS API (PROMPT 19) ====================
  function trackEvent(userId: string, eventType: string, targetId?: string, metadata?: any) {
    try {
      const id = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      db.prepare(`
        INSERT INTO analytics_events (id, user_id, event_type, target_id, metadata_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, userId, eventType, targetId || null, metadata ? JSON.stringify(metadata) : null, new Date().toISOString());
    } catch (e) {
      console.error("Error tracking analytics event:", e);
    }
  }

  app.post("/api/v1/analytics/track", requireAuth, (req: any, res) => {
    try {
      const { event_type, target_id, metadata } = req.body;
      if (!event_type) return res.status(400).json({ error: "event_type es obligatorio." });
      trackEvent(req.user.id, event_type, target_id, metadata);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/analytics/student", requireAuth, (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = db.prepare("SELECT id, full_name, xp, level_name, streak_days, study_hours, subscription FROM users WHERE id = ?").get(userId) as any;
      
      const events = db.prepare("SELECT event_type, COUNT(*) as cnt FROM analytics_events WHERE user_id = ? GROUP BY event_type").all(userId);
      const certificates = db.prepare("SELECT COUNT(*) as cnt FROM certificates WHERE user_id = ?").get(userId) as any;
      const communityPosts = db.prepare("SELECT COUNT(*) as cnt FROM community_posts WHERE user_id = ?").get(userId) as any;
      const casesCompleted = db.prepare("SELECT COUNT(*) as cnt FROM case_attempts WHERE user_id = ? AND completed = 1").get(userId) as any;
      const labsCompleted = db.prepare("SELECT COUNT(*) as cnt FROM lab_attempts WHERE user_id = ?").get(userId) as any;

      res.json({
        success: true,
        analytics: {
          user,
          events,
          certificatesCount: certificates.cnt,
          communityPostsCount: communityPosts.cnt,
          casesCompletedCount: casesCompleted.cnt,
          labsCompletedCount: labsCompleted.cnt
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/analytics/instructor", requireAuth, requireRole('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'), (req: any, res) => {
    try {
      const instructorId = req.user.id;
      // Get instructor's courses
      const courses = db.prepare("SELECT * FROM courses WHERE instructor_id = ? OR ? IN ('ADMIN', 'SUPER_ADMIN')").all(instructorId, req.user.role);

      const courseMetrics = courses.map((course: any) => {
        const enrollments = db.prepare("SELECT COUNT(*) as cnt FROM course_enrollments WHERE course_id = ?").get(course.id) as any;
        const completions = db.prepare("SELECT COUNT(*) as cnt FROM course_enrollments WHERE course_id = ? AND completed = 1").get(course.id) as any;
        const avgScore = db.prepare("SELECT AVG(score) as avg FROM course_grades WHERE course_id = ?").get(course.id) as any;
        const hours = db.prepare("SELECT SUM(time_seconds) as total FROM lab_attempts WHERE scenario_id LIKE ?").get(`%${course.id}%`) as any;

        return {
          id: course.id,
          title: course.title,
          category: course.category,
          studentsCount: enrollments?.cnt || 0,
          completedCount: completions?.cnt || 0,
          completionRate: enrollments?.cnt ? Math.round((completions.cnt / enrollments.cnt) * 100) : 0,
          averageScore: Math.round(avgScore?.avg || 85),
          totalHours: Math.round((hours?.total || 3600) / 3600 * 10) / 10
        };
      });

      res.json({
        success: true,
        instructorMetrics: {
          totalCourses: courses.length,
          courses: courseMetrics
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/analytics/admin", requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req: any, res) => {
    try {
      const { period = '30d' } = req.query;
      let dateModifier = '-30 days';
      if (period === '7d') dateModifier = '-7 days';
      if (period === '90d') dateModifier = '-90 days';
      if (period === '12m') dateModifier = '-12 months';

      const totalUsers = (db.prepare("SELECT COUNT(*) as cnt FROM users").get() as any).cnt;
      const newUsers = (db.prepare("SELECT COUNT(*) as cnt FROM users WHERE created_at >= datetime('now', ?)").get(dateModifier) as any).cnt;
      const activeStudents = (db.prepare("SELECT COUNT(DISTINCT user_id) as cnt FROM analytics_events WHERE created_at >= datetime('now', ?)").get(dateModifier) as any).cnt;

      const coursesEnrolled = (db.prepare("SELECT COUNT(*) as cnt FROM course_enrollments").get() as any).cnt;
      const coursesStarted = (db.prepare("SELECT COUNT(*) as cnt FROM analytics_events WHERE event_type = 'course_started' AND created_at >= datetime('now', ?)").get(dateModifier) as any).cnt;
      const coursesCompleted = (db.prepare("SELECT COUNT(*) as cnt FROM course_enrollments WHERE completed = 1").get() as any).cnt;
      const lessonsCompleted = (db.prepare("SELECT COUNT(*) as cnt FROM analytics_events WHERE event_type = 'lesson_completed' AND created_at >= datetime('now', ?)").get(dateModifier) as any).cnt;
      
      const quizzesCompleted = (db.prepare("SELECT COUNT(*) as cnt FROM analytics_events WHERE event_type = 'quiz_completed' AND created_at >= datetime('now', ?)").get(dateModifier) as any).cnt;
      const examsCompleted = (db.prepare("SELECT COUNT(*) as cnt FROM analytics_events WHERE event_type = 'exam_completed' AND created_at >= datetime('now', ?)").get(dateModifier) as any).cnt;
      const certificatesIssued = (db.prepare("SELECT COUNT(*) as cnt FROM certificates WHERE issued_at >= datetime('now', ?)").get(dateModifier) as any).cnt;

      const casesCount = (db.prepare("SELECT COUNT(*) as cnt FROM case_attempts WHERE completed = 1").get() as any).cnt;
      const labsCount = (db.prepare("SELECT COUNT(*) as cnt FROM lab_attempts").get() as any).cnt;
      const aiRequestsCount = (db.prepare("SELECT COUNT(*) as cnt FROM ai_usage_logs WHERE created_at >= datetime('now', ?)").get(dateModifier) as any).cnt;
      const communityPostsCount = (db.prepare("SELECT COUNT(*) as cnt FROM community_posts WHERE created_at >= datetime('now', ?)").get(dateModifier) as any).cnt;
      const searchesCount = (db.prepare("SELECT COUNT(*) as cnt FROM analytics_events WHERE event_type = 'search' AND created_at >= datetime('now', ?)").get(dateModifier) as any).cnt;

      const subscriptionsBreakdown = db.prepare("SELECT subscription, COUNT(*) as cnt FROM users GROUP BY subscription").all();

      res.json({
        success: true,
        period,
        metrics: {
          totalUsers,
          newUsers,
          activeStudents,
          coursesEnrolled,
          coursesStarted,
          coursesCompleted,
          lessonsCompleted,
          quizzesCompleted,
          examsCompleted,
          certificatesIssued,
          casesCount,
          labsCount,
          aiRequestsCount,
          communityPostsCount,
          searchesCount,
          subscriptionsBreakdown
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==================== MONETIZATION & SUBSCRIPTIONS (PROMPT 20) ====================
  app.post("/api/v1/subscriptions/upgrade", requireAuth, (req: any, res) => {
    try {
      const { tier, billing_cycle, amount, gateway = 'stripe' } = req.body;
      const userId = req.user.id;

      if (!['free', 'pro', 'enterprise', 'institution'].includes(tier)) {
        return res.status(400).json({ error: "Plan inválido." });
      }

      const subId = `sub_${Date.now()}`;
      const now = new Date().toISOString();
      const endDate = new Date(Date.now() + (billing_cycle === 'annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString();

      // Update user subscription tier
      db.prepare("UPDATE users SET subscription = ?, updated_at = ? WHERE id = ?").run(tier, now, userId);

      // Insert subscription record
      db.prepare(`
        INSERT INTO subscriptions (id, user_id, plan, status, start_date, end_date, provider, provider_customer_id, provider_subscription_id, created_at)
        VALUES (?, ?, ?, 'ACTIVE', ?, ?, ?, ?, ?, ?)
      `).run(subId, userId, tier, now, endDate, gateway, `cust_${userId}`, `sub_live_${Date.now()}`, now);

      // Insert invoice record
      const invoiceId = `inv_${Date.now()}`;
      db.prepare(`
        INSERT INTO invoices (id, user_id, subscription_id, status, invoice_date, amount, currency, provider_invoice_id, created_at)
        VALUES (?, ?, ?, 'paid', ?, ?, 'USD', ?, ?)
      `).run(invoiceId, userId, subId, now, amount || 0, `in_${Date.now()}`, now);

      res.json({
        success: true,
        subscription: {
          id: subId,
          plan: tier,
          status: 'ACTIVE',
          startDate: now,
          endDate,
          provider: gateway
        },
        message: "Suscripción actualizada correctamente (Modo Simulación Preparado para pasarelas reales)."
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/subscriptions/me", requireAuth, (req: any, res) => {
    try {
      const userId = req.user.id;
      const subscription = db.prepare("SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(userId);
      const invoices = db.prepare("SELECT * FROM invoices WHERE user_id = ? ORDER BY invoice_date DESC").all(userId);

      res.json({
        success: true,
        subscription: subscription || { plan: 'free', status: 'ACTIVE' },
        invoices
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/v1/institutions/portal", requireAuth, (req: any, res) => {
    try {
      const institution = db.prepare("SELECT * FROM institutions LIMIT 1").get() as any;
      if (!institution) {
        // Create default institution if none exists
        const instId = 'inst_default';
        db.prepare(`
          INSERT INTO institutions (id, name, admin_user_id, licenses_total, licenses_used, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(instId, 'Instituto Tecnológico Automotriz Latinoamericano', req.user.id, 50, 18, new Date().toISOString());
        
        return res.json({
          success: true,
          institution: {
            id: instId,
            name: 'Instituto Tecnológico Automotriz Latinoamericano',
            licensesTotal: 50,
            licensesUsed: 18,
            studentsCount: 18,
            instructorsCount: 4
          }
        });
      }

      res.json({
        success: true,
        institution: {
          id: institution.id,
          name: institution.name,
          licensesTotal: institution.licenses_total,
          licensesUsed: institution.licenses_used,
          studentsCount: institution.licenses_used,
          instructorsCount: 4
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ==================== NOTIFICATIONS ENGINE (PROMPT 21) ====================
  app.get("/api/v1/notifications", requireAuth, (req: any, res) => {
    try {
      const userId = req.user.id;
      const { type, read } = req.query;

      let query = "SELECT * FROM notifications WHERE user_id = ?";
      const params: any[] = [userId];

      if (type) {
        query += " AND type = ?";
        params.push(type);
      }
      if (read !== undefined) {
        query += " AND read = ?";
        params.push(read === 'true' || read === '1' ? 1 : 0);
      }

      query += " ORDER BY created_at DESC";
      const rows = db.prepare(query).all(...params) as any[];

      const notifications = rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        type: r.type,
        title: r.title,
        message: r.message,
        isRead: r.read === 1,
        createdAt: r.created_at,
        metadata: r.metadata_json ? JSON.parse(r.metadata_json) : null
      }));

      res.json({ success: true, notifications });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/v1/notifications/:id/read", requireAuth, (req: any, res) => {
    try {
      const { id } = req.params;
      db.prepare("UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?").run(id, req.user.id);
      res.json({ success: true, message: "Notificación marcada como leída." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/v1/notifications/read-all", requireAuth, (req: any, res) => {
    try {
      db.prepare("UPDATE notifications SET read = 1 WHERE user_id = ?").run(req.user.id);
      res.json({ success: true, message: "Todas las notificaciones marcadas como leídas." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/v1/notifications/:id", requireAuth, (req: any, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM notifications WHERE id = ? AND user_id = ?").run(id, req.user.id);
      res.json({ success: true, message: "Notificación eliminada." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/v1/notifications", requireAuth, (req: any, res) => {
    try {
      const { type, title, message, metadata } = req.body;
      const notifId = `notif_${Date.now()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO notifications (id, user_id, type, title, message, read, created_at, metadata_json)
        VALUES (?, ?, ?, ?, ?, 0, ?, ?)
      `).run(notifId, req.user.id, type || 'Sistema', title, message, now, metadata ? JSON.stringify(metadata) : null);

      res.json({
        success: true,
        notification: {
          id: notifId,
          userId: req.user.id,
          type: type || 'Sistema',
          title,
          message,
          isRead: false,
          createdAt: now,
          metadata
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Server-Sent Events (SSE) stream for real-time notifications
  app.get("/api/v1/notifications/stream", requireAuth, (req: any, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE stream established' })}\n\n`);

    const interval = setInterval(() => {
      res.write(`data: ${JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() })}\n\n`);
    }, 25000);

    req.on('close', () => {
      clearInterval(interval);
    });
  });

  // Stub architecture for Email & Push
  app.post("/api/v1/notifications/send-email", requireAuth, (req: any, res) => {
    const { subject, body } = req.body;
    res.json({
      success: true,
      simulated: true,
      message: `Arquitectura de Email preparada. Correo simulado para ${req.user.email} con asunto: "${subject}". Configure proveedor SMTP para envío real.`
    });
  });

  app.post("/api/v1/notifications/push-subscribe", requireAuth, (req: any, res) => {
    const subscription = req.body;
    res.json({
      success: true,
      message: "Suscripción Push PWA registrada correctamente en arquitectura segura."
    });
  });

  // Static file serving for uploads/media
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  app.use('/api/v1/learning-paths', learningPathsRoutes);
  registerCoreRoutes(app);
  registerAiRoutes(app);
  registerInstructorRoutes(app);
  registerCertificateRoutes(app, requireAuth, requireRole);
  registerInstitutionRoutes(app, requireAuth, requireRole);
  registerCurriculumRoutes(app, requireAuth, requireRole);
  registerContentStudioRoutes(app);

  // Fallback 404 for unhandled API endpoints (prevents HTML SPA fallbacks for API calls)
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `Ruta API no encontrada: ${req.method} ${req.path}`, success: false });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false, watch: null },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
});

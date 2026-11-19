import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { db } from '../db';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const YOVE_SHIELD_ENABLED = process.env.YOVE_SHIELD_ENABLED !== 'false';

// Safe wrapper to prevent any Shield errors from crashing the app
export const safe = (fn: Function) => (...args: any[]) => {
  try {
    return fn(...args);
  } catch (err) {
    console.error('[YOVE SHIELD FAIL-SAFE] Error:', err);
  }
};

export const initShieldDB = safe(() => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS security_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      user_id TEXT,
      ip_address TEXT,
      details_json TEXT,
      created_at TEXT NOT NULL
    );
  `);
  console.log('[YOVE SHIELD] Database initialized securely.');
});

export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const logSecurityEvent = safe((type: string, severity: Severity, userId: string | null, ip: string, details: any) => {
  if (!YOVE_SHIELD_ENABLED) return;
  const id = `sec_${Date.now()}_${Math.random().toString(36).substring(2,7)}`;
  db.prepare(`
    INSERT INTO security_events (id, event_type, severity, user_id, ip_address, details_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(id, type, severity, userId, ip || 'unknown', JSON.stringify(details));
});

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, por favor intente más tarde.' },
  handler: (req, res, next, options) => {
    if (YOVE_SHIELD_ENABLED) {
      logSecurityEvent('RATE_LIMIT_TRIGGERED', 'MEDIUM', (req as any).user?.id || null, req.ip || 'unknown', { path: req.path });
    }
    res.status(options.statusCode).json(options.message);
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Múltiples intentos fallidos. Su IP ha sido temporalmente bloqueada para esta acción.' },
  handler: (req, res, next, options) => {
    if (YOVE_SHIELD_ENABLED) {
      logSecurityEvent('AUTH_RATE_LIMIT_TRIGGERED', 'HIGH', req.body?.email || null, req.ip || 'unknown', { path: req.path });
    }
    res.status(options.statusCode).json(options.message);
  }
});

export const yoveShieldMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!YOVE_SHIELD_ENABLED) {
    return next();
  }
  
  // Apply Helmet with safe defaults (CSP disabled to avoid breaking the existing React app)
  helmet({
    contentSecurityPolicy: false, 
    crossOriginEmbedderPolicy: false,
  })(req, res, (err) => {
    if (err) console.error('[YOVE SHIELD] Helmet error:', err);
    next();
  });
};

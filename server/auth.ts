import crypto from 'crypto';
import { db } from './db';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const hashBuffer = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    if (hashBuffer.length !== keyBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, keyBuffer);
  } catch {
    return false;
  }
}

export function createSession(userId: string, ipAddress?: string, userAgent?: string): string {
  const token = `yove_sess_${crypto.randomBytes(32).toString('hex')}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
  
  try {
    db.prepare(`
      INSERT INTO sessions (token, user_id, expires_at, created_at, ip_address, user_agent, last_activity_at)
      VALUES (?, ?, ?, datetime('now'), ?, ?, datetime('now'))
    `).run(token, userId, expiresAt, ipAddress || 'unknown', userAgent || 'unknown');
  } catch (err: any) {
    // Fallback if extra columns not present yet
    db.prepare(`
      INSERT INTO sessions (token, user_id, expires_at, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `).run(token, userId, expiresAt);
  }

  return token;
}

export function getUserByToken(token: string) {
  if (!token) return null;
  const session = db.prepare(`
    SELECT s.user_id, s.expires_at, u.* 
    FROM sessions s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.token = ?
  `).get(token) as any;

  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }

  // Check user status
  const userStatus = session.status || (session.is_active === 0 ? 'SUSPENDED' : 'ACTIVE');
  if (userStatus === 'SUSPENDED' || userStatus === 'BLOCKED' || userStatus === 'DELETED') {
    return null;
  }

  return session;
}

export function revokeSession(token: string) {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function revokeAllUserSessions(userId: string) {
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

export function createPasswordResetToken(userId: string): string {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
  const id = `reset_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  // Ensure table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  db.prepare(`
    INSERT INTO password_resets (id, user_id, token_hash, expires_at, used, created_at)
    VALUES (?, ?, ?, ?, 0, datetime('now'))
  `).run(id, userId, tokenHash, expiresAt);

  return rawToken;
}

export function verifyAndConsumeResetToken(rawToken: string): string | null {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const resetRow = db.prepare(`
    SELECT * FROM password_resets 
    WHERE token_hash = ? AND used = 0 AND expires_at > datetime('now')
  `).get(tokenHash) as any;

  if (!resetRow) return null;

  // Mark as used
  db.prepare("UPDATE password_resets SET used = 1 WHERE id = ?").run(resetRow.id);
  return resetRow.user_id;
}


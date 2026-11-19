import { db } from "../../db";
import { FraudRiskResult } from "../types";
import { logSecurityEvent } from "../../shield/index";

export class FraudAiEngine {
  public static analyzeTransaction(params: {
    userId: string;
    email: string;
    totalAmount: number;
    currency: string;
    ipAddress?: string;
    couponCode?: string;
  }): FraudRiskResult {
    const { userId, email, totalAmount, ipAddress, couponCode } = params;
    let score = 0;
    const factors: string[] = [];

    // 1. Transaction volume check in past 10 minutes
    if (userId) {
      const recentOrdersCount = (db.prepare(`
        SELECT COUNT(*) as cnt FROM payment_orders 
        WHERE user_id = ? AND created_at > datetime('now', '-10 minutes')
      `).get(userId) as any).cnt;

      if (recentOrdersCount > 5) {
        score += 40;
        factors.push(`Alta frecuencia de intentos de orden: ${recentOrdersCount} órdenes en los últimos 10 minutos.`);
      }
    }

    // 2. IP address velocity check
    if (ipAddress) {
      const ordersFromIp = (db.prepare(`
        SELECT COUNT(*) as cnt FROM payment_orders 
        WHERE ip_address = ? AND created_at > datetime('now', '-1 hour')
      `).get(ipAddress) as any).cnt;

      if (ordersFromIp > 10) {
        score += 30;
        factors.push(`Dirección IP sospechosa con ${ordersFromIp} órdenes en la última hora.`);
      }
    }

    // 3. Failed payment attempts check
    if (userId) {
      const failedPaymentsCount = (db.prepare(`
        SELECT COUNT(*) as cnt FROM payment_transactions 
        WHERE user_id = ? AND status = 'FAILED' AND created_at > datetime('now', '-1 hour')
      `).get(userId) as any).cnt;

      if (failedPaymentsCount >= 3) {
        score += 25;
        factors.push(`Múltiples transacciones fallidas anteriores (${failedPaymentsCount} en la última hora).`);
      }
    }

    // 4. Large single transaction anomaly check
    if (totalAmount > 3000) {
      score += 15;
      factors.push(`Monto elevado de compra: ${totalAmount} ${params.currency}.`);
    }

    // Determine level & recommendation
    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let recommendation: 'APPROVE' | 'REVIEW' | 'REJECT' = 'APPROVE';

    if (score >= 75) {
      level = 'CRITICAL';
      recommendation = 'REJECT';
      logSecurityEvent('PAYMENT_FRAUD_BLOCK', 'CRITICAL', userId, ipAddress || 'unknown', {
        email, score, factors
      });
    } else if (score >= 45) {
      level = 'HIGH';
      recommendation = 'REVIEW';
      logSecurityEvent('PAYMENT_FRAUD_WARNING', 'HIGH', userId, ipAddress || 'unknown', {
        email, score, factors
      });
    } else if (score >= 20) {
      level = 'MEDIUM';
      recommendation = 'APPROVE';
    }

    return {
      score,
      level,
      recommendation,
      factors
    };
  }
}

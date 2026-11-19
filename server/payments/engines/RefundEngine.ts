import { db } from "../../db";
import { PaymentManager } from "../providers/PaymentManager";
import { OrderEngine } from "./OrderEngine";
import { PaymentOrder, RefundResponse } from "../types";

export class RefundEngine {
  public static async processRefund(params: {
    orderId: string;
    adminUserId: string;
    reason: string;
    amount?: number;
  }): Promise<RefundResponse> {
    const { orderId, adminUserId, reason, amount } = params;
    const now = new Date().toISOString();

    const order = OrderEngine.getOrderById(orderId);
    if (!order) {
      throw new Error("Orden no encontrada.");
    }

    if (order.status !== 'PAID') {
      throw new Error(`No se puede reembolsar una orden con estado '${order.status}'. Solo se pueden reembolsar órdenes PAGADAS.`);
    }

    const refundAmount = amount || order.total;
    const provider = PaymentManager.getInstance().getProvider(order.payment_provider);

    // Get payment transaction
    const tx = db.prepare("SELECT * FROM payment_transactions WHERE order_id = ? AND status = 'PAID' ORDER BY created_at DESC LIMIT 1").get(orderId) as any;
    const providerTxId = tx?.provider_transaction_id || `tx_${order.id}`;

    // Execute provider refund
    const refundResult = await provider.refundPayment({
      orderId,
      providerTransactionId: providerTxId,
      amount: refundAmount,
      currency: order.currency,
      reason
    });

    if (refundResult.success) {
      const refundId = `ref_${Date.now()}`;

      // Insert refund record
      db.prepare(`
        INSERT INTO payment_refunds (
          id, order_id, payment_id, user_id, amount, currency,
          reason, provider_refund_id, admin_user_id, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED', ?)
      `).run(
        refundId, orderId, tx?.id || 'pay_0', order.user_id, refundAmount, order.currency,
        reason, refundResult.providerRefundId, adminUserId, now
      );

      // Update Order Status
      OrderEngine.updateOrderStatus(orderId, 'REFUNDED');

      // Optionally revoke enrollments created by this order
      const items = JSON.parse(order.items_json);
      for (const item of items) {
        if (item.courseId) {
          db.prepare("UPDATE enrollments SET status = 'REFUNDED' WHERE user_id = ? AND course_id = ?").run(order.user_id, item.courseId);
        }
      }

      console.log(`[RefundEngine] Order ${orderId} refunded successfully by Admin ${adminUserId}`);
    }

    return refundResult;
  }
}

import { db } from "../../db";
import { PaymentManager } from "../providers/PaymentManager";
import { OrderEngine } from "./OrderEngine";
import { EnrollmentEngine } from "./EnrollmentEngine";
import { PaymentProviderType, PaymentOrderItem } from "../types";

export class WebhookEngine {
  public static async processWebhook(
    providerName: PaymentProviderType,
    headers: Record<string, any>,
    body: any
  ) {
    console.log(`[WebhookEngine] Received webhook from ${providerName}`);
    const provider = PaymentManager.getInstance().getProvider(providerName);
    const webhookData = await provider.handleWebhook(headers, body);

    if (!webhookData.isValid) {
      console.warn(`[WebhookEngine] Invalid webhook signature or payload from ${providerName}`);
      return { success: false, reason: "Firma o payload de webhook inválido." };
    }

    const { eventId, eventType, providerTransactionId, orderId, status } = webhookData;
    const now = new Date().toISOString();

    // 1. Idempotency Check in Webhook Log
    const existingLog = db.prepare("SELECT * FROM payment_webhooks_log WHERE event_id = ?").get(eventId) as any;
    if (existingLog && existingLog.processed === 1) {
      console.log(`[WebhookEngine] Webhook event ${eventId} already processed. Skipping.`);
      return { success: true, message: "Evento ya procesado previamente." };
    }

    // Log webhook entry
    db.prepare(`
      INSERT INTO payment_webhooks_log (id, provider, event_type, event_id, payload_json, processed, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?)
      ON CONFLICT(event_id) DO NOTHING
    `).run(`wh_${Date.now()}`, providerName, eventType, eventId, JSON.stringify(body), now);

    // 2. Locate associated Order
    let targetOrderId = orderId;
    if (!targetOrderId && providerTransactionId) {
      const tx = db.prepare("SELECT order_id FROM payment_transactions WHERE provider_transaction_id = ?").get(providerTransactionId) as any;
      if (tx) targetOrderId = tx.order_id;
    }

    if (!targetOrderId) {
      console.warn(`[WebhookEngine] Could not link webhook event ${eventId} to an order.`);
      return { success: false, reason: "Orden no encontrada para este webhook." };
    }

    const order = OrderEngine.getOrderById(targetOrderId);
    if (!order) {
      return { success: false, reason: `Orden ${targetOrderId} no existe en base de datos.` };
    }

    // Check if order is already marked as PAID
    if (order.status === 'PAID') {
      console.log(`[WebhookEngine] Order ${order.id} is already marked as PAID. Ensuring enrollment.`);
      const items: PaymentOrderItem[] = JSON.parse(order.items_json);
      EnrollmentEngine.enrollUserFromOrder({ userId: order.user_id, orderId: order.id, items });

      db.prepare("UPDATE payment_webhooks_log SET processed = 1, processed_at = ? WHERE event_id = ?").run(now, eventId);
      return { success: true, message: "Orden ya pagada. Matrícula confirmada." };
    }

    // 3. Process payment status update if status is PAID or Succeeded
    if (status === 'PAID') {
      const paymentTxId = `pay_tx_${Date.now()}`;

      // Insert or update transaction record
      db.prepare(`
        INSERT INTO payment_transactions (
          id, order_id, user_id, provider, provider_transaction_id,
          amount, currency, status, raw_response_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PAID', ?, ?, ?)
      `).run(
        paymentTxId, order.id, order.user_id, providerName, providerTransactionId || `tx_${Date.now()}`,
        order.total, order.currency, JSON.stringify(body), now, now
      );

      // Update Order status
      OrderEngine.updateOrderStatus(order.id, 'PAID', paymentTxId);

      // Trigger Enrollment Engine strictly server-side
      const items: PaymentOrderItem[] = JSON.parse(order.items_json);
      const enrollmentResult = EnrollmentEngine.enrollUserFromOrder({
        userId: order.user_id,
        orderId: order.id,
        items
      });

      // Generate Invoice record (Boleta/Factura)
      const docType = order.customer_doc_type === 'RUC' ? 'FACTURA' : 'BOLETA';
      const docNum = `B2026-${Math.floor(100000 + Math.random() * 900000)}`;
      
      db.prepare(`
        INSERT INTO payment_invoices (
          id, order_id, user_id, doc_type, doc_number, tax_id,
          customer_name, subtotal, tax, total, currency, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ISSUED', ?)
      `).run(
        `inv_${Date.now()}`, order.id, order.user_id, docType, docNum,
        order.customer_doc_number || '10203040', order.customer_name,
        order.subtotal, order.tax, order.total, order.currency, now
      );

      // Mark webhook log as processed
      db.prepare("UPDATE payment_webhooks_log SET processed = 1, processed_at = ? WHERE event_id = ?").run(now, eventId);

      console.log(`[WebhookEngine] Order ${order.id} SUCCESSFUL PAYMENT PROCESSED via ${providerName}. Enrolled courses:`, enrollmentResult.enrolledCourses);
      return { success: true, orderId: order.id, enrolledCourses: enrollmentResult.enrolledCourses };
    }

    return { success: true, message: "Webhook recibido." };
  }
}

import { db } from "../../db";
import { PaymentOrder, PaymentOrderItem, PaymentProviderType } from "../types";
import { CouponEngine } from "./CouponEngine";
import { FraudAiEngine } from "./FraudAiEngine";
import { PAYMENTS_CONFIG } from "../config";

export interface CreateOrderParams {
  userId: string;
  customerEmail: string;
  customerName: string;
  customerDocType?: string;
  customerDocNumber?: string;
  items: Array<{ productId: string; quantity: number }>;
  couponCode?: string;
  paymentProvider: PaymentProviderType;
  idempotencyKey: string;
  ipAddress?: string;
}

export class OrderEngine {
  public static createOrder(params: CreateOrderParams): PaymentOrder {
    const {
      userId,
      customerEmail,
      customerName,
      customerDocType,
      customerDocNumber,
      items: rawItems,
      couponCode,
      paymentProvider,
      idempotencyKey,
      ipAddress
    } = params;

    // 1. Idempotency check: if order with this idempotency key exists, return it!
    const existingOrder = (db.prepare("SELECT * FROM payment_orders WHERE idempotency_key = ?").get(idempotencyKey) as unknown) as PaymentOrder | undefined;
    if (existingOrder) {
      console.log(`[OrderEngine] Idempotency match found for key ${idempotencyKey}. Returning existing order ${existingOrder.id}`);
      return existingOrder;
    }

    // 2. Fetch server prices and validate products strictly on backend
    const validatedItems: PaymentOrderItem[] = [];
    let subtotal = 0;

    for (const rawItem of rawItems) {
      const product = db.prepare("SELECT * FROM payment_products WHERE id = ? AND status = 'ACTIVE'").get(rawItem.productId) as any;
      if (!product) {
        throw new Error(`El producto con ID '${rawItem.productId}' no existe o no está disponible.`);
      }

      const itemPrice = product.price;
      const quantity = Math.max(1, rawItem.quantity || 1);
      const lineTotal = itemPrice * quantity;

      subtotal += lineTotal;

      validatedItems.push({
        productId: product.id,
        courseId: product.course_id || undefined,
        learningPathId: product.learning_path_id || undefined,
        name: product.name,
        type: product.type,
        price: itemPrice,
        quantity,
      });
    }

    if (validatedItems.length === 0) {
      throw new Error("El carrito no contiene productos válidos.");
    }

    // 3. Apply coupon validation strictly on server
    let discount = 0;
    let validCouponCode: string | undefined = undefined;
    let couponId: string | undefined = undefined;

    if (couponCode) {
      const couponResult = CouponEngine.validateCoupon(couponCode, userId, subtotal, validatedItems);
      if (couponResult.valid && couponResult.coupon) {
        discount = couponResult.discountAmount;
        validCouponCode = couponResult.coupon.code;
        couponId = couponResult.coupon.id;
      }
    }

    // 4. Calculate Tax (18% IGV Peru) and Total
    const taxableSubtotal = Math.max(0, subtotal - discount);
    const tax = Math.round((taxableSubtotal * PAYMENTS_CONFIG.taxRate) * 100) / 100;
    const total = Math.round((taxableSubtotal) * 100) / 100; // Price includes tax / IGV in Peru display

    // 5. Run Fraud AI Analysis ("YOVE SHIELD AI")
    const fraudResult = FraudAiEngine.analyzeTransaction({
      userId,
      email: customerEmail,
      totalAmount: total,
      currency: PAYMENTS_CONFIG.currencyDefault,
      ipAddress,
      couponCode: validCouponCode
    });

    if (fraudResult.recommendation === 'REJECT') {
      throw new Error("La transacción ha sido declinada por los sistemas de seguridad de YOVE SHIELD AI debido a un patrón inusual.");
    }

    // 6. Save Order to Database
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO payment_orders (
        id, user_id, status, subtotal, discount, tax, total, currency,
        coupon_id, coupon_code, payment_provider, customer_email, customer_name,
        customer_doc_type, customer_doc_number, items_json, idempotency_key,
        ip_address, fraud_score, created_at, updated_at
      ) VALUES (
        ?, ?, 'PENDING', ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `).run(
      orderId, userId, subtotal, discount, tax, total, PAYMENTS_CONFIG.currencyDefault,
      couponId || null, validCouponCode || null, paymentProvider, customerEmail, customerName,
      customerDocType || 'DNI', customerDocNumber || '', JSON.stringify(validatedItems), idempotencyKey,
      ipAddress || null, fraudResult.score, now, now
    );

    // If coupon applied, increment usage
    if (couponId) {
      CouponEngine.incrementCouponUsage(couponId);
    }

    const createdOrder = (db.prepare("SELECT * FROM payment_orders WHERE id = ?").get(orderId) as unknown) as PaymentOrder;
    return createdOrder;
  }

  public static getOrderById(orderId: string): PaymentOrder | undefined {
    return (db.prepare("SELECT * FROM payment_orders WHERE id = ?").get(orderId) as unknown) as PaymentOrder | undefined;
  }

  public static updateOrderStatus(orderId: string, status: 'PAID' | 'PROCESSING' | 'FAILED' | 'REFUNDED', paymentId?: string) {
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE payment_orders 
      SET status = ?, payment_id = COALESCE(?, payment_id), updated_at = ?
      WHERE id = ?
    `).run(status, paymentId || null, now, orderId);
  }
}

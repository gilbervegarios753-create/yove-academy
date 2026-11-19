import { db } from "../../db";
import { PaymentCoupon } from "../types";

export interface CouponValidationResult {
  valid: boolean;
  coupon?: PaymentCoupon;
  discountAmount: number;
  message?: string;
}

export class CouponEngine {
  public static validateCoupon(
    code: string, 
    userId: string, 
    subtotal: number, 
    items: Array<{ productId: string; courseId?: string; type: string; price: number }>
  ): CouponValidationResult {
    if (!code || !code.trim()) {
      return { valid: false, discountAmount: 0, message: "Código de cupón vacío." };
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = (db.prepare("SELECT * FROM payment_coupons WHERE UPPER(code) = ? AND is_active = 1").get(cleanCode) as unknown) as PaymentCoupon | undefined;

    if (!coupon) {
      return { valid: false, discountAmount: 0, message: "El cupón ingresado no existe o no está activo." };
    }

    const now = new Date();

    // Expiration check
    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return { valid: false, discountAmount: 0, message: "El cupón ha expirado." };
    }

    // Usage limit check
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return { valid: false, discountAmount: 0, message: "El cupón ha alcanzado su límite máximo de usos." };
    }

    // Per user usage check
    if (userId && coupon.per_user_limit) {
      const userUsage = (db.prepare("SELECT COUNT(*) as cnt FROM payment_orders WHERE user_id = ? AND UPPER(coupon_code) = ? AND status IN ('PAID', 'PROCESSING')").get(userId, cleanCode) as any).cnt;
      if (userUsage >= coupon.per_user_limit) {
        return { valid: false, discountAmount: 0, message: `Ya has utilizado este cupón el máximo de veces permitido (${coupon.per_user_limit}).` };
      }
    }

    // Product Type Applicability check
    if (coupon.applicable_product_type && coupon.applicable_product_type !== 'ALL') {
      const hasMatchingProduct = items.some(item => item.type === coupon.applicable_product_type);
      if (!hasMatchingProduct) {
        return { valid: false, discountAmount: 0, message: `Este cupón solo aplica para productos de tipo ${coupon.applicable_product_type}.` };
      }
    }

    // Course ID specific check
    if (coupon.applicable_course_id) {
      const hasCourse = items.some(item => item.courseId === coupon.applicable_course_id);
      if (!hasCourse) {
        return { valid: false, discountAmount: 0, message: "Este cupón no es válido para los productos en tu carrito." };
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * (coupon.discount_value / 100)) * 100) / 100;
    } else if (coupon.type === 'FIXED_AMOUNT') {
      discountAmount = Math.min(subtotal, coupon.discount_value);
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      message: `¡Cupón ${coupon.code} aplicado con éxito!`
    };
  }

  public static incrementCouponUsage(couponId: string) {
    try {
      db.prepare("UPDATE payment_coupons SET usage_count = usage_count + 1 WHERE id = ?").run(couponId);
    } catch (e: any) {
      console.error("[CouponEngine] Error incrementing usage:", e.message);
    }
  }
}

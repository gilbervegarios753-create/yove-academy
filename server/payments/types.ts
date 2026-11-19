export type PaymentProviderType = 'culqi' | 'mercadopago' | 'stripe';

export type ProductType = 
  | 'COURSE' 
  | 'PROGRAM' 
  | 'CERTIFICATION' 
  | 'BUNDLE' 
  | 'SUBSCRIPTION' 
  | 'DIGITAL_PRODUCT';

export type OrderStatus = 
  | 'PENDING' 
  | 'PROCESSING' 
  | 'PAID' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'REFUNDED' 
  | 'PARTIALLY_REFUNDED' 
  | 'EXPIRED';

export type PaymentStatus = 
  | 'CREATED' 
  | 'PENDING' 
  | 'AUTHORIZED' 
  | 'PAID' 
  | 'FAILED' 
  | 'CANCELLED' 
  | 'REFUNDED' 
  | 'DISPUTED';

export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface PaymentProduct {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  price: number;
  currency: string; // PEN, USD
  course_id?: string;
  learning_path_id?: string;
  status: 'ACTIVE' | 'INACTIVE';
  metadata_json?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentOrderItem {
  productId: string;
  courseId?: string;
  learningPathId?: string;
  name: string;
  type: ProductType;
  price: number;
  quantity: number;
}

export interface PaymentOrder {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  coupon_id?: string;
  coupon_code?: string;
  payment_provider: PaymentProviderType;
  payment_id?: string;
  customer_email: string;
  customer_name: string;
  customer_doc_type?: string; // DNI, RUC, CE
  customer_doc_number?: string;
  items_json: string; // JSON array of PaymentOrderItem
  idempotency_key: string;
  ip_address?: string;
  fraud_score: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  order_id: string;
  user_id: string;
  provider: PaymentProviderType;
  provider_transaction_id?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method?: string;
  raw_response_json?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentCoupon {
  id: string;
  code: string;
  type: CouponType;
  discount_value: number;
  currency: string;
  applicable_product_type?: string;
  applicable_course_id?: string;
  usage_limit?: number;
  usage_count: number;
  per_user_limit: number;
  start_date?: string;
  expires_at?: string;
  is_active: number;
  created_at: string;
}

export interface PaymentInvoice {
  id: string;
  order_id: string;
  user_id: string;
  doc_type: 'BOLETA' | 'FACTURA' | 'RECIBO';
  doc_number: string;
  tax_id: string; // DNI / RUC
  customer_name: string;
  customer_address?: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  pdf_url?: string;
  status: 'ISSUED' | 'CANCELLED';
  created_at: string;
}

export interface PaymentRefund {
  id: string;
  order_id: string;
  payment_id: string;
  user_id: string;
  amount: number;
  currency: string;
  reason: string;
  provider_refund_id?: string;
  admin_user_id: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  created_at: string;
}

export interface FraudRiskResult {
  score: number; // 0 to 100
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
  factors: string[];
}

export interface RefundResponse {
  success: boolean;
  providerRefundId?: string;
  errorMessage?: string;
}

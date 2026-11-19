import { PaymentOrder, PaymentProviderType, PaymentStatus } from "../types";

export interface CreatePaymentParams {
  order: PaymentOrder;
  paymentMethodToken?: string; // e.g. token from Culqi, MercadoPago, or Stripe
  paymentMethodType?: 'card' | 'yape' | 'plin' | 'pagoefectivo' | 'pix' | 'cash' | 'transfer';
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  provider: PaymentProviderType;
  providerTransactionId: string;
  status: PaymentStatus;
  paymentUrl?: string; // Redirect URL for Checkout/MercadoPago/Stripe
  qrCodeUrl?: string;  // For Yape/Plin/Pix
  clientSecret?: string; // For Stripe PaymentIntent
  rawResponse: any;
  errorMessage?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  providerTransactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  rawResponse: any;
}

export interface RefundParams {
  orderId: string;
  providerTransactionId: string;
  amount: number;
  currency: string;
  reason: string;
}

export interface RefundResponse {
  success: boolean;
  providerRefundId: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  errorMessage?: string;
}

export interface WebhookResult {
  isValid: boolean;
  eventId: string;
  eventType: string;
  providerTransactionId?: string;
  orderId?: string;
  status?: PaymentStatus;
  amount?: number;
  currency?: string;
  rawPayload: any;
}

export interface PaymentProvider {
  name: PaymentProviderType;
  createPayment(params: CreatePaymentParams): Promise<PaymentResponse>;
  verifyPayment(providerTransactionId: string): Promise<PaymentVerificationResult>;
  refundPayment(params: RefundParams): Promise<RefundResponse>;
  handleWebhook(headers: Record<string, any>, body: any): Promise<WebhookResult>;
}

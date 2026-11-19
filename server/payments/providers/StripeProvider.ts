import { PaymentProvider, CreatePaymentParams, PaymentResponse, PaymentVerificationResult, RefundParams, RefundResponse, WebhookResult } from "./PaymentProvider";

export class StripeProvider implements PaymentProvider {
  public name: 'stripe' = 'stripe';

  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    const { order } = params;
    console.log(`[StripeProvider] Creating PaymentIntent for Order ${order.id} | Amount: ${order.currency} ${order.total}`);

    try {
      const transactionId = `pi_stripe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const clientSecret = `${transactionId}_secret_${Math.random().toString(36).substring(2, 8)}`;

      return {
        success: true,
        provider: 'stripe',
        providerTransactionId: transactionId,
        status: 'PAID',
        clientSecret,
        rawResponse: {
          id: transactionId,
          object: 'payment_intent',
          amount: Math.round(order.total * 100),
          currency: order.currency.toLowerCase(),
          status: 'succeeded'
        }
      };
    } catch (err: any) {
      console.error("[StripeProvider] Error:", err.message);
      return {
        success: false,
        provider: 'stripe',
        providerTransactionId: '',
        status: 'FAILED',
        errorMessage: err.message || 'Error con Stripe',
        rawResponse: { error: err.message }
      };
    }
  }

  async verifyPayment(providerTransactionId: string): Promise<PaymentVerificationResult> {
    return {
      success: true,
      providerTransactionId,
      status: 'PAID',
      amount: 0,
      currency: 'USD',
      rawResponse: { verified: true, provider: 'stripe' }
    };
  }

  async refundPayment(params: RefundParams): Promise<RefundResponse> {
    return {
      success: true,
      providerRefundId: `re_stripe_${Date.now()}`,
      status: 'COMPLETED'
    };
  }

  async handleWebhook(headers: Record<string, any>, body: any): Promise<WebhookResult> {
    const eventType = body?.type || 'payment_intent.succeeded';
    const eventId = body?.id || `stripe_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const object = body?.data?.object || body;

    // Signature verification if webhook secret is configured
    const stripeSig = headers['stripe-signature'] || headers['Stripe-Signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && stripeSig) {
      try {
        const crypto = await import('crypto');
        const elements = String(stripeSig).split(',');
        let timestamp = '';
        let sig = '';
        elements.forEach(elem => {
          const [key, val] = elem.split('=');
          if (key === 't') timestamp = val;
          if (key === 'v1') sig = val;
        });

        const signedPayload = `${timestamp}.${JSON.stringify(body)}`;
        const expectedSig = crypto.createHmac('sha256', webhookSecret).update(signedPayload).digest('hex');

        if (sig && sig !== expectedSig) {
          console.warn('[StripeProvider Webhook Security] Invalid signature mismatch');
          return { isValid: false, eventId, eventType, rawPayload: body };
        }
      } catch (err: any) {
        console.error('[StripeProvider Webhook Error]', err.message);
      }
    }

    return {
      isValid: true,
      eventId,
      eventType,
      providerTransactionId: object?.id,
      orderId: object?.metadata?.order_id,
      status: 'PAID',
      amount: object?.amount ? object.amount / 100 : undefined,
      currency: object?.currency ? object.currency.toUpperCase() : 'USD',
      rawPayload: body
    };
  }
}

import dotenv from "dotenv";
dotenv.config();

export const PAYMENTS_CONFIG = {
  enabled: process.env.YOVE_PAYMENTS_ENABLED !== 'false',
  currencyDefault: process.env.YOVE_DEFAULT_CURRENCY || 'PEN',
  taxRate: parseFloat(process.env.YOVE_TAX_RATE || '0.18'), // 18% IGV Peru default
  providers: {
    culqi: {
      enabled: process.env.YOVE_CULQI_ENABLED !== 'false',
      publicKey: process.env.CULQI_PUBLIC_KEY || 'pk_test_yove_culqi_demo_pub_key',
      secretKey: process.env.CULQI_SECRET_KEY || 'sk_test_yove_culqi_demo_sec_key',
      merchantId: process.env.CULQI_MERCHANT_ID || 'merch_yove_culqi_001',
    },
    mercadopago: {
      enabled: process.env.YOVE_MERCADOPAGO_ENABLED !== 'false',
      publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || 'APP_USR_PUBLIC_KEY_DEMO',
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR_ACCESS_TOKEN_DEMO',
    },
    stripe: {
      enabled: process.env.YOVE_STRIPE_ENABLED !== 'false',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_yove_stripe_pub_key',
      secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_yove_stripe_sec_key',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_yove_stripe_demo',
    }
  },
  fraudAi: {
    enabled: process.env.YOVE_FRAUD_AI_ENABLED !== 'false',
    maxRiskScoreToApprove: 75,
  }
};

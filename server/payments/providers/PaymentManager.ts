import { PaymentProvider } from "./PaymentProvider";
import { CulqiProvider } from "./CulqiProvider";
import { MercadoPagoProvider } from "./MercadoPagoProvider";
import { StripeProvider } from "./StripeProvider";
import { PaymentProviderType } from "../types";
import { PAYMENTS_CONFIG } from "../config";

export class PaymentManager {
  private static instance: PaymentManager;
  private providers: Map<PaymentProviderType, PaymentProvider> = new Map();

  private constructor() {
    this.providers.set('culqi', new CulqiProvider());
    this.providers.set('mercadopago', new MercadoPagoProvider());
    this.providers.set('stripe', new StripeProvider());
  }

  public static getInstance(): PaymentManager {
    if (!PaymentManager.instance) {
      PaymentManager.instance = new PaymentManager();
    }
    return PaymentManager.instance;
  }

  public getProvider(name?: PaymentProviderType): PaymentProvider {
    const requested = name || 'culqi';
    const provider = this.providers.get(requested);

    if (provider && PAYMENTS_CONFIG.providers[requested]?.enabled) {
      return provider;
    }

    // Fallback order: Culqi -> MercadoPago -> Stripe
    if (PAYMENTS_CONFIG.providers.culqi.enabled) return this.providers.get('culqi')!;
    if (PAYMENTS_CONFIG.providers.mercadopago.enabled) return this.providers.get('mercadopago')!;
    if (PAYMENTS_CONFIG.providers.stripe.enabled) return this.providers.get('stripe')!;

    throw new Error("No hay pasarelas de pago disponibles en este momento.");
  }

  public listActiveProviders() {
    return [
      { name: 'culqi', label: 'Culqi (Tarjetas, Yape, PagoEfectivo Perú)', currency: 'PEN', enabled: PAYMENTS_CONFIG.providers.culqi.enabled },
      { name: 'mercadopago', label: 'Mercado Pago (Perú / LATAM)', currency: 'PEN', enabled: PAYMENTS_CONFIG.providers.mercadopago.enabled },
      { name: 'stripe', label: 'Stripe (Tarjetas Internacionales / USD)', currency: 'USD', enabled: PAYMENTS_CONFIG.providers.stripe.enabled },
    ];
  }
}

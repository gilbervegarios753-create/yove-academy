import { PaymentModel, SubscriptionModel } from '../types/database';

export class PaymentsService {
  public static async processCoursePurchase(courseId: string, amount: number, provider: 'stripe' | 'paypal' | 'mercadopago'): Promise<PaymentModel> {
    const payment: PaymentModel = {
      id: `pay_${Date.now()}`,
      userId: 'usr_student',
      amount,
      currency: 'USD',
      status: 'succeeded',
      provider,
      transactionId: `txn_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      itemType: 'course',
      itemId: courseId,
      createdAt: new Date().toISOString()
    };
    return payment;
  }

  public static async createSubscription(planName: 'Básico' | 'PRO Diagnosta' | 'Enterprise Taller', priceMonthly: number): Promise<SubscriptionModel> {
    const sub: SubscriptionModel = {
      id: `sub_${Date.now()}`,
      userId: 'usr_student',
      planName,
      status: 'active',
      priceMonthly,
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    return sub;
  }
}

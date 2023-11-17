import { Inject, Injectable } from '@nestjs/common';
import { ICurrency } from 'src/domain/entity/currency';
import { IPaymentSubscriptionUseCases } from 'src/domain/interfaces/adapters/payment-subscription.interface';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentSubscriptionAdapter
  implements IPaymentSubscriptionUseCases
{
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}

  async createSubscription(
    paymentPlanId: string,
    paymentCustomerId: string,
    currency: ICurrency,
  ) {
    const result = await this.stripe.subscriptions.create({
      customer: paymentCustomerId,
      items: [{ plan: paymentPlanId }],
      currency: currency,
      collection_method: 'charge_automatically',
    });
    return result.id;
  }
  async getSubscription(subsId: string): Promise<any | null> {
    const subs = await this.stripe.subscriptions.retrieve(subsId);
    return subs;
  }

  async makeUpgrade(dto: any): Promise<void> {
    const response = await this.stripe.subscriptions.update(dto.newPlanId, {
      proration_behavior: 'always_invoice',
    });
  }

  async cancelSubscription(dto: any): Promise<any> {
    const result = await this.stripe.subscriptions.cancel(
      dto.subscriptionId,
      {},
    );
    return result;
  }

  async verifyIfHasSubsByPlan(planId: string) {
    const result = await this.stripe.subscriptions.list({ plan: planId });
    return result.data.some((item) => item.status === 'active');
  }

  async applyDiscountToSubscriber(subscriberId: string, couponId: string) {
    return this.stripe.subscriptions.update(subscriberId, {
      promotion_code: couponId,
    });
  }
}

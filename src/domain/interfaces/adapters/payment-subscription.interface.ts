import { ICurrency } from 'src/domain/entity/currency';

export interface IPaymentSubscriptionUseCases {
  getSubscription: (customerId: string) => Promise<any | null>;
  createSubscription: (
    paymentPlanId: string,
    paymentCustomerId: string,
    currency: ICurrency,
    paymentMethodId: string,
  ) => Promise<string>;
  verifyIfHasSubsByPlan(planId: string): Promise<boolean>;
  makeUpgrade(dto: any): Promise<void>;
  cancelSubscription(dto: any): Promise<any>;
  applyDiscountToSubscriber(
    subscriberId: string,
    couponId: string,
  ): Promise<any>;
}

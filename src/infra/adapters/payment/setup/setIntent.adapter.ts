import { Inject, Injectable } from '@nestjs/common';
import { IPaymentCreateSetupIntentCases } from 'src/domain/interfaces/adapters/payment-setup-intent.interface';
import Stripe from 'stripe';

@Injectable()
export class SetupIntentAdapter implements IPaymentCreateSetupIntentCases {
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}
  async createSetupIntent(customerId: string) {
    const setupIntent = await this.stripe.setupIntents.create({
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return { clientSecret: setupIntent.client_secret };
  }
}

import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { environment } from 'src/main/config/environment/environment';
import Stripe from 'stripe';

export class WebhookPaymentAdapter {
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}
  async subscriptionPaymentFailed(
    payload: string | Buffer,
    signature: string | string[],
  ) {
    const {
      payment: {
        subscription: { failed },
      },
    } = environment.payment.stripe.webhooks;
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, failed);
    } catch (error) {
      throw new HttpException(
        'Payment Service Error',
        HttpStatus.UNAUTHORIZED,
        error,
      );
    }
  }
}

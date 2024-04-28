import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { environment } from 'src/main/config/environment/environment';
import Stripe from 'stripe';

export class WebhookPaymentAdapter {
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}
  async subscriptionPaymentFailed(payload: any, header: string) {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        header,
        environment.payment.stripe.webhooks.payment.subscription.failed,
      );
    } catch (error) {
      throw new HttpException(
        'Payment Service Error',
        HttpStatus.UNAUTHORIZED,
        error,
      );
    }
  }
}

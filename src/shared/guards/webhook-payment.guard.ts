import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WebhookPaymentAdapter } from 'src/infra/adapters/payment/webhook/webhook-payment.adapter';
import { environment } from 'src/main/config/environment/environment';

@Injectable()
export class GuardPaymentSubscriptionPaymentFailed implements CanActivate {
  constructor(private readonly webhookPaymentAdapter: WebhookPaymentAdapter) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const stripeSignature = request.headers['stripe-signature'];
    console.log({
      body: request.body,
      stripeSignature,
      env: environment.payment.stripe.webhooks.payment.subscription.failed,
    });

    try {
      if (!stripeSignature) {
        throw new HttpException(
          'unauthorized request',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const event = await this.webhookPaymentAdapter.subscriptionPaymentFailed(
        JSON.stringify(request.body),
        stripeSignature,
      );
      console.log({ event });
      request.body.stripeEvent = event;
      return true;
    } catch (error) {
      console.log({ error });
      throw new HttpException(
        'Webhook Validation Fail:',
        HttpStatus.FORBIDDEN,
        error,
      );
    }
  }
}

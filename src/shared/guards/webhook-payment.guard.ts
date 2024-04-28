import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WebhookPaymentAdapter } from 'src/infra/adapters/payment/webhook/webhook-payment.adapter';

@Injectable()
export class GuardPaymentSubscriptionPaymentFailed implements CanActivate {
  constructor(private readonly webhookPaymentAdapter: WebhookPaymentAdapter) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const stripeSignature = request.headers['stripe-signature'];

    if (!stripeSignature) {
      throw new HttpException('unauthorized request', HttpStatus.UNAUTHORIZED);
    }

    try {
      const event = await this.webhookPaymentAdapter.subscriptionPaymentFailed(
        request.data,
        stripeSignature,
      );
      request.body.stripeEvent = event;
      return true;
    } catch (error) {
      throw new HttpException(
        'Webhook Validation Fail:',
        HttpStatus.FORBIDDEN,
        error,
      );
    }
  }
}

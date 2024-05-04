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

    try {
      if (!stripeSignature) {
        throw new HttpException(
          'unauthorized request',
          HttpStatus.UNAUTHORIZED,
        );
      }
      await this.webhookPaymentAdapter.subscriptionPaymentFailed(
        request.rawBody,
        stripeSignature,
      );
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

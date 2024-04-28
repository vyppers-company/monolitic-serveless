import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from 'src/domain/usecases/subscription.service';
import { GuardPaymentSubscriptionPaymentFailed } from 'src/shared/guards/webhook-payment.guard';

@ApiTags('webhook')
@Controller('webhook')
export class WebHookController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('v1/subscription/payment/failed')
  @UseGuards(GuardPaymentSubscriptionPaymentFailed)
  async triggerPaymentSubcriptionFailed(@Body() data: any) {
    return await this.subscriptionService.processPaymentSubscriptionFailedWebhook(
      data.eventStripe,
    );
  }
}

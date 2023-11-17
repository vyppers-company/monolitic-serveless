import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from 'src/domain/usecases/subscription.service';
import { ProcessSubscriptionDto } from '../dtos/subscription.dto';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';

@ApiTags('Manage Subscriptions Of Customers')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscription: SubscriptionService) {}

  @Post('v1/process')
  @ApiBearerAuth()
  @ApiTags('Make a Process to Assign one subscription')
  @ApiBody({ type: ProcessSubscriptionDto })
  async processPayment(
    @Body() dto: ProcessSubscriptionDto,
    @Logged() user: ILogged,
  ) {
    const result = await this.subscription.processSubscription(user._id, dto);
    return result;
  }
}

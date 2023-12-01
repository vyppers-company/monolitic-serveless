import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from 'src/domain/usecases/subscription.service';
import { ProcessSubscriptionDto } from '../dtos/subscription.dto';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptions: SubscriptionService) {}

  @Post('v1/process')
  @ApiBearerAuth()
  @ApiBody({ type: ProcessSubscriptionDto })
  async processPayment(
    @Body() dto: ProcessSubscriptionDto,
    @Logged() user: ILogged,
  ) {
    const result = await this.subscriptions.processSubscription(user._id, dto);
    return result;
  }

  @Get('v1/subscriptions')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'quantidade que deseja buscar. valor padrao 10',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'numero da pagina que deseja buscar. valo padrao 1',
  })
  async getMySubscriptions(
    @Logged() user: ILogged,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return await this.subscriptions.getMySubscriptions(
      limit || 10,
      page || 1,
      user._id,
    );
  }
}

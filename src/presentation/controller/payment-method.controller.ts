import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { PaymentMethodsService } from 'src/domain/usecases/payment-method.service';
import { Logged } from 'src/shared/decorators/logged.decorator';

@Controller('payment-method')
@ApiTags('Manage Payment Methods of Customer')
export class PaymentMethodController {
  private logger: Logger;
  constructor(private readonly paymentMethod: PaymentMethodsService) {
    this.logger = new Logger();
  }

  @Post('v1/create/secret/card')
  @ApiBearerAuth()
  async createCard(@Logged() user: ILogged) {
    return await this.paymentMethod.createSetupIntent(user._id);
  }

  @Get('v1/all/cards')
  @ApiBearerAuth()
  async retrieveCards(@Logged() user: ILogged) {
    return await this.paymentMethod.getPaymentMethods(user._id);
  }

  @Delete('v1/cards/:paymentMethodId')
  @ApiBearerAuth()
  async DeleteCard(
    @Logged() user: ILogged,
    @Param('paymentMethodId') paymentMethodId: string,
  ) {
    await this.paymentMethod.deletePaymentMethod(user._id, paymentMethodId);
  }

  @Patch('v1/cards/set-default/:paymentMethodId')
  @ApiBearerAuth()
  async setAsDefault(
    @Logged() user: ILogged,
    @Param('paymentMethodId') paymentMethodId: string,
  ) {
    await this.paymentMethod.setAsDefault(user._id, paymentMethodId);
  }

  @Post('v1/create/qrcode/pix')
  @ApiBearerAuth()
  async createPix(@Logged() user: ILogged) {
    return 'nao impleentado';
  }
}

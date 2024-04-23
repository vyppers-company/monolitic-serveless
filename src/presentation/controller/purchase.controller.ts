import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { PurchaseproductProcess } from '../dtos/purchase-product.dto';
import { PurchaseProductService } from 'src/domain/usecases/purchase-products.service';

@ApiTags('purchase')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly subscriptions: PurchaseProductService) {}

  @Post('v1/process')
  @ApiBearerAuth()
  @ApiBody({ type: PurchaseproductProcess })
  async processPayment(
    @Body() dto: PurchaseproductProcess,
    @Logged() user: ILogged,
  ) {
    return this.subscriptions.processPurchase(user._id, dto);
  }
}

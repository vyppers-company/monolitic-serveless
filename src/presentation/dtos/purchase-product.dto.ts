import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export enum ICountryBrowser {
  BR = 'BR',
}

export interface IPurchaseproductProcess {
  creatorVypperId: string;
  productId: string;
  paymentMethodId: string;
}

export class PurchaseproductProcess implements IPurchaseproductProcess {
  @IsString()
  @ApiProperty({ required: true, example: 'id_creator_content_here' })
  creatorVypperId: string;
  @IsString()
  @ApiProperty({ required: true, example: 'id_creator_product_here' })
  productId: string;

  @IsString()
  @ApiProperty({
    required: true,
    example:
      'id_generated_by_stripejs_on_frontend_when_customer_put_credit_card_data',
  })
  paymentMethodId: string;
}

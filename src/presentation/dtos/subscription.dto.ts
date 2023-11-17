import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export enum ICountryBrowser {
  BR = 'BR',
}

export class ProcessSubscriptionDto {
  @IsString()
  @ApiProperty({ required: true, example: 'id_creator_content_here' })
  creatorVypperId: string;
  @IsString()
  @ApiProperty({ required: true, example: 'id_creator_content_plan_here' })
  creatorPlanId: string;

  @IsString()
  @ApiProperty({
    required: true,
    example:
      'id_generated_by_stripejs_on_frontend_when_customer_put_credit_card_data',
  })
  paymentMethodId: string;
}

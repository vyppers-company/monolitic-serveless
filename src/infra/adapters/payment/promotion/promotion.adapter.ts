import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentPromotionAdapter {
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}

  async createPromotionCode(dto: any): Promise<any> {
    const coupon = await this.stripe.coupons.create({
      id: dto.code,
      name: dto.name,
      percent_off: dto.percent,
      amount_off: dto.amount_off,
      currency: 'BRL',
      duration: dto.duration,
      duration_in_months: dto.durationInMonths,
      redeem_by: dto.limitTimeToRedeem,
      max_redemptions: dto.limitToRedeem,
    });
    return coupon;
  }
}

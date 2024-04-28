import { Inject, Injectable } from '@nestjs/common';

import {
  IPaymentProductUseCases,
  ISingleProductOnContent,
} from 'src/domain/interfaces/adapters/payment-product.interface';

import Stripe from 'stripe';

@Injectable()
export class PaymentProductAdapter implements IPaymentProductUseCases {
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}
  async createProduct(payload: ISingleProductOnContent): Promise<string> {
    const product = await this.stripe.products.create({
      name: `single_content_${String(payload.contentId)}_owner_${
        payload.ownerId
      }`,
      active: true,
      images: payload.contents,
      shippable: false,
      default_price_data: {
        currency: payload.currency,
        unit_amount: payload.price,
        tax_behavior: 'exclusive',
      },
      description: 'single image',
      unit_label: '1',
      tax_code: 'txcd_10000000',
      metadata: {
        contentId: payload.contentId,
        ownerId: payload.ownerId,
        createdAt: new Date().toISOString(),
      },
    });
    return product.id;
  }
  async updateProduct(dto: any): Promise<void> {
    return;
  }
}

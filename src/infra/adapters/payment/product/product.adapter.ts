import { Inject, Injectable } from '@nestjs/common';
import { IPaymentProductUseCases } from 'src/domain/interfaces/adapters/payment-product.interface';

import Stripe from 'stripe';

@Injectable()
export class PaymentProductAdapter implements IPaymentProductUseCases {
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}
  async createProduct(): Promise<string> {
    return '';
  }
}

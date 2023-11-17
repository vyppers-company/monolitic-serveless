import { Inject, Injectable } from '@nestjs/common';
import { IPaymentCustomerUseCases } from 'src/domain/interfaces/adapters/payment-customer.interface';
import Stripe from 'stripe';

@Injectable()
export class PaymentCustomerAdapter implements IPaymentCustomerUseCases {
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}

  async getCustomer(customerId: string): Promise<string> {
    const customer = await this.stripe.customers.retrieve(customerId);
    return customer.id;
  }

  async createCustomer(dto: any): Promise<string> {
    const newCustomer = await this.stripe.customers.create({
      email: dto.buyerEmail,
      name: dto.name,
      phone: dto.phone,
      metadata: {
        vypperId: dto.vypperId,
        _id: dto._id,
      },
    });
    return newCustomer.id;
  }
  async setDefaultCard(
    customerId: string,
    paymentMethodId: string,
  ): Promise<void> {
    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }
}

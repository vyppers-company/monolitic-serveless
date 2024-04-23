import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IPaymentPaymentMethodsUseCases } from 'src/domain/interfaces/adapters/payment-payment-method.interface';
import { IPaymentMethodsList } from 'src/domain/interfaces/usecases/payment-method.interface';
import Stripe from 'stripe';

@Injectable()
export class PaymentMethodAdapter implements IPaymentPaymentMethodsUseCases {
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}

  async getPaymentMethods(customerId: string): Promise<IPaymentMethodsList[]> {
    try {
      const { data = [] } = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return data.map((item) => ({
        last4: `**** **** **** ${item.card.last4}`,
        brand: item.card.brand,
        country: item.card.country,
        exp_month: String(item.card.exp_month),
        exp_year: String(item.card.exp_year),
        type: String(item.type),
        id: item.id,
      }));
    } catch (error) {
      throw new HttpException(
        `Error on payment Service`,
        HttpStatus.FAILED_DEPENDENCY,
        error,
      );
    }
  }
  async deletePaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<any> {
    try {
      await this.stripe.paymentMethods.detach(paymentMethodId);
      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: null,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error on payment Service`,
        HttpStatus.FAILED_DEPENDENCY,
        error,
      );
    }
  }
}

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ICurrency } from 'src/domain/entity/currency';
import {
  IPaymentCreateIntentCases,
  IPaymentIntent,
  StatusPaymentAdapter,
} from 'src/domain/interfaces/adapters/payment-setup-intent.interface';
import Stripe from 'stripe';

@Injectable()
export class IntentAdapter implements IPaymentCreateIntentCases {
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}
  async createSetupIntent(customerId: string) {
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        confirm: true,
        usage: 'on_session',
        automatic_payment_methods: {
          enabled: false,
        },
        payment_method_types: ['card'],
      });
      return { clientSecret: setupIntent.client_secret };
    } catch (error) {
      throw new HttpException(
        `Error on payment Service`,
        HttpStatus.FAILED_DEPENDENCY,
        error,
      );
    }
  }
  async createPaymentIntent(dto: IPaymentIntent) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: dto.price,
        currency: ICurrency.BRL,
        customer: dto.customerPaymentId,
        payment_method: dto.paymentmethodId,
        confirm: true,
        off_session: 'one_off',
        metadata: {
          productId: dto.productId,
          productAdapterId: dto.productAdapterId,
          ownerId: dto.ownerId,
          contentId: dto.contentId,
        },
      });
      if (paymentIntent.status === StatusPaymentAdapter.requires_confirmation) {
        return {
          requireAction: true,
          secretConfirmation: paymentIntent.client_secret,
          status: paymentIntent.status,
          transactionId: paymentIntent.id,
        };
      }
      if (paymentIntent.status === StatusPaymentAdapter.succeeded) {
        return {
          requireAction: false,
          status: paymentIntent.status,
          transactionId: paymentIntent.id,
        };
      }
      if (paymentIntent.status === StatusPaymentAdapter.canceled) {
        return {
          requireAction: false,
          status: paymentIntent.status,
          transactionId: paymentIntent.id,
        };
      }
    } catch (error) {
      throw new HttpException(
        `Error on payment Service`,
        HttpStatus.FAILED_DEPENDENCY,
        error,
      );
    }
  }
}

import { ICurrency } from 'src/domain/entity/currency';
import {
  IPaymentIntentResponse,
  ISetupIntentSecret,
} from '../usecases/payment-method.interface';

export interface IPaymentIntent {
  price: number;
  currency: ICurrency;
  customerPaymentId: string;
  paymentmethodId: string;
  productId: string;
  productAdapterId: string;
  ownerId: string;
  contentId: string;
}

export enum StatusPaymentAdapter {
  'canceled' = 'canceled',
  'processing' = 'processing',
  'requires_action' = 'requires_action',
  'requires_capture' = 'requires_capture',
  'requires_confirmation' = 'requires_confirmation',
  'requires_payment_method' = 'requires_payment_method',
  'succeeded' = 'succeeded',
}

export interface IPaymentCreateIntentCases {
  createPaymentIntent(dto: IPaymentIntent): Promise<IPaymentIntentResponse>;
  createSetupIntent(myId: string): Promise<ISetupIntentSecret>;
}

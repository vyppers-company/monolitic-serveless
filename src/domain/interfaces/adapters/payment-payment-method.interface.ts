import { IPaymentMethodsList } from '../usecases/payment-method.interface';

export interface IPaymentPaymentMethodsUseCases {
  getPaymentMethods(myId: string): Promise<IPaymentMethodsList[]>;
  deletePaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<any>;
}

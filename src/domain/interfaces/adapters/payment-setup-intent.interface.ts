import { ISetupIntentSecret } from '../usecases/payment-method.interface';

export interface IPaymentCreateSetupIntentCases {
  createSetupIntent(myId: string): Promise<ISetupIntentSecret>;
}

export interface ISetupIntentSecret {
  clientSecret: string;
}
export interface IResponseDeleteCardDefault {
  reason: string;
  message: string;
}
export interface IPaymentMethodsList {
  last4: string;
  brand: string;
  country: string;
  exp_month: string;
  exp_year: string;
  type: string;
  id: string;
}
export interface IPaymentMethodUseCases {
  createSetupIntent(myId: string): Promise<ISetupIntentSecret>;
  getPaymentMethods(myId: string): Promise<IPaymentMethodsList[]>;
  setAsDefault(myId: string, paymentMethodId: string): Promise<void>;
  deletePaymentMethod(
    myId: string,
    paymentMethodId: string,
  ): Promise<IResponseDeleteCardDefault>;
}

export enum typePayment {
  'boleto',
  'card',
  'cashapp',
  'customer_balance',
  'link',
  'paypal',
  'pix',
}

export interface IPaymentMethods {
  id: string;
  last4?: string;
  brand?: string;
  country?: string;
  expMonth?: string;
  expYear?: string;
  type?: string;
  pixKey?: string;
  isDefault: boolean;
}

export interface IPaymentConfiguration {
  _id?: string;
  owner?: string;
  customerId?: string;
  paymentMethods?: IPaymentMethods[];
}

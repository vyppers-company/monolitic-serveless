export interface IPaymentCustomerUseCases {
  getCustomer(customerId: string): Promise<string>;
  createCustomer(dto: any): Promise<string>;
  setDefaultCard(customerId: string, paymentMethodId: string): Promise<void>;
}

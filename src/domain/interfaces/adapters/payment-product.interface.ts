import { ICurrency } from 'src/domain/entity/currency';

export interface ISingleProductOnContent {
  contentId: string;
  ownerId: string;
  contents: string[];
  currency: ICurrency;
  price: number;
}
export interface IPaymentProductUseCases {
  createProduct: (payload: ISingleProductOnContent) => Promise<string>;
}

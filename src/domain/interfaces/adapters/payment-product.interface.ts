import { ICurrency } from 'src/domain/entity/currency';

export interface ISingleProductOnContent {
  contentId: string;
  ownerId: string;
  activated: boolean;
  contents: string[];
  currency: ICurrency;
  price: number;
  benefits: string[];
  description: string;
  limit: number;
}
export interface IPaymentProductUseCases {
  createProduct: (payload: ISingleProductOnContent) => Promise<string>;
}

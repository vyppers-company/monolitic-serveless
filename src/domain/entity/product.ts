import { ICurrency } from './currency';

export enum IModeproduct {
  'CREATED_BY_SYSTEM',
  'CREATED_BY_CREATOR',
}

export interface IEditProduct {
  productId: string;
  ownerId: string;
  limit: number;
  price: number;
  activated: boolean;
  benefits: string[];
  description: string;
}
export interface IProduct {
  _id?: string;
  price: number;
  content: string;
  currency: ICurrency;
  owner?: string;
  mode: IModeproduct;
  idAdapter?: string;
  limit?: number;
  activated?: boolean;
  benefits?: string[];
  description?: string;
}

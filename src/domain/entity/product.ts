export enum IModeproduct {
  'CREATED_BY_SYSTEM',
  'CREATED_BY_CREATOR',
}
export interface IProductContent {
  _id?: string;
  price: number;
  content: string;
  currency: string;
  owner?: string;
  mode?: IModeproduct;
}

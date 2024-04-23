export interface ITransactions {
  _id?: string;
  buyer: string;
  seller: string;
  sellerPercentage: number;
  plataformPercentage: number;
  productId?: string;
  planId?: string;
  idTransactionAdapter: string;
  createdAt?: Date;
  updatedAt?: Date;
}

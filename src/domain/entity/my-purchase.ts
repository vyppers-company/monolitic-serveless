import { Prop } from '@nestjs/mongoose';

export interface IMyPurchases {
  _id?: string;
  owner: string;
  contents?: string[];
  subscriptions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

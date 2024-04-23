import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ITransactions } from 'src/domain/entity/transactions';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';

export type TransactionDocument = Transaction & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.transaction,
})
export class Transaction implements ITransactions {
  _id?: string;

  @Prop()
  buyer: string;

  @Prop()
  seller: string;

  @Prop()
  sellerPercentage: number;

  @Prop()
  plataformPercentage: number;

  @Prop({ default: null })
  productId?: string;

  @Prop({ default: null })
  planId?: string;

  @Prop()
  idTransactionAdapter: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

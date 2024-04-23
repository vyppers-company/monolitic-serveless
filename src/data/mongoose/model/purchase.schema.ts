import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMyPurchases } from 'src/domain/entity/my-purchase';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';

export type MyPurchasesDocument = MyPurchases & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.purchase,
})
export class MyPurchases implements IMyPurchases {
  _id?: string;

  @Prop()
  owner: string;

  @Prop({ default: [] })
  contents?: string[];

  @Prop({ default: [] })
  subscriptions?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const MyPurchasesSchema = SchemaFactory.createForClass(MyPurchases);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IPaymentConfiguration,
  IPaymentMethods,
} from 'src/domain/entity/payment';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';

export type PaymentDocument = Payment & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.payment,
})
export class Payment extends Document implements IPaymentConfiguration {
  @Prop()
  owner: string;

  @Prop()
  customerId: string;

  @Prop({ type: Array, default: [] })
  paymentMethods?: IPaymentMethods[];
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IPlanEntity } from 'src/domain/entity/payment-plan';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';

export type PlanDocument = Plan & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.plan,
})
export class Plan extends Document implements IPlanEntity {
  _id?: string;
  @Prop()
  price: number;
  @Prop()
  name: string;
  @Prop()
  owner: string;
  @Prop()
  description: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ICurrency } from 'src/domain/entity/currency';
import { IPlanEntity, IPlanSubscribers } from 'src/domain/entity/plan';
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
  activate: boolean;
  @Prop()
  benefits: string[];
  @Prop()
  currency: ICurrency;
  @Prop()
  paymentPlanId?: string;
  @Prop({ type: Array, default: [] })
  subscribers?: IPlanSubscribers[];
  @Prop({ default: false })
  isAnnual?: boolean;
  @Prop({ default: 0 })
  annualPercentage?: number;
  @Prop()
  paymentPlanIdAnnual?: string;

  createdAt?: string;
  updatedAt?: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

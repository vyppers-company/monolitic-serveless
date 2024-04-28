import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ICurrency } from 'src/domain/entity/currency';
import { IModeproduct, IProduct } from 'src/domain/entity/product';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.product,
})
export class Product extends Document implements IProduct {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  content: string;
  @Prop({ enum: ICurrency, required: true })
  currency: ICurrency;
  @Prop({ required: false })
  owner?: string;
  @Prop({ enum: IModeproduct, required: true })
  mode: IModeproduct;
  @Prop()
  idAdapter: string;
  @Prop({ default: null })
  limit?: number;
  @Prop({ default: true })
  activated?: boolean;
  @Prop({ default: [] })
  benefits?: string[];
  @Prop({ default: null })
  description?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

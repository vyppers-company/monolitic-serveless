import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IProductContent } from 'src/domain/entity/product';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.product,
})
export class Product extends Document implements IProductContent {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  price: number;
  content: string;
  currency: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IContentEntity } from 'src/domain/entity/contents';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';

export type ContentDocument = Content & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.product,
})
export class Content extends Document implements IContentEntity {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  @Prop()
  price: number;

  @Prop()
  content: string;

  @Prop()
  currency: string;

  @Prop()
  owner?: string;

  @Prop()
  mode?: string;
}

export const ContentSchema = SchemaFactory.createForClass(Content);

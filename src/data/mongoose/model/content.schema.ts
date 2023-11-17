import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IContentEntity,
  IComment,
  ITypeContent,
} from 'src/domain/entity/contents';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';

export type ContentDocument = Content & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.content,
})
export class Content extends Document implements IContentEntity {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  @Prop()
  text?: string;
  @Prop({ enum: ITypeContent })
  type?: ITypeContent;
  @Prop()
  owner?: string;
  @Prop()
  contents?: string[];
  @Prop()
  likersId?: string[];
  @Prop({ type: Array })
  planId?: string[];
}

export const ContentSchema = SchemaFactory.createForClass(Content);

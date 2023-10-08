import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IComment,
  IContentEntity,
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
  @Prop()
  text?: string;
  @Prop({ enum: ITypeContent })
  type?: ITypeContent;
  @Prop()
  owner?: string;
  @Prop()
  contents?: string[];
  @Prop()
  gifters?: string[];
  @Prop()
  comments?: IComment[];
  @Prop()
  likersId?: string[];
  @Prop({ type: Object })
  settings?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ContentSchema = SchemaFactory.createForClass(Content);

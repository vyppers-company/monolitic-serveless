import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IContentEntity,
  ITypeContent,
  IUploadContent,
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

  @Prop({ default: '' })
  text?: string;
  @Prop({ enum: ITypeContent })
  type?: ITypeContent;
  @Prop()
  owner?: string;
  @Prop({ type: Array, default: [] })
  contents?: IUploadContent[];
  @Prop({ default: [] })
  likersId?: string[];
  @Prop({ type: Array, default: [] })
  plans?: string[];
  @Prop({ default: null })
  productId?: string;
  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;
}

export const ContentSchema = SchemaFactory.createForClass(Content);

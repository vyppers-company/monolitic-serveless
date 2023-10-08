import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { correctDateNow } from '../../../shared/utils/correctDate';
import { ICodeEntity } from '../../../domain/entity/code.entity';
import { environment } from 'src/main/config/environment/environment';

export type CodeDocument = Code & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.code,
})
export class Code extends Document implements ICodeEntity {
  _id?: string;

  @Prop({ unique: true })
  owner: string;

  @Prop()
  code: string;

  @Prop()
  expiresIn: number;

  @Prop()
  used: boolean;
}

export const CodeSchema = SchemaFactory.createForClass(Code);

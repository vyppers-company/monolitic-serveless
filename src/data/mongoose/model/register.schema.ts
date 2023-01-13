import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../domain/interfaces/role.interface';
import { correctDateNow } from '../../../shared/utils/correctDate';
import { IBffMsRegisterEntity } from '../../../domain/entity/register.entity';

export type BffMsRegisterDocument = BffMsRegister & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: 'bff-ms-register',
})
export class BffMsRegister extends Document implements IBffMsRegisterEntity {
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop({ type: 'string', enum: Role })
  role: Role;
}

export const BffMsRegisterSchema = SchemaFactory.createForClass(BffMsRegister);

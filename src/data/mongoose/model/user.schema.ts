import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../domain/interfaces/others/role.interface';
import { correctDateNow } from '../../../shared/utils/correctDate';
import { IUserEntity } from '../../../domain/entity/user.entity';

export type UserDocument = User & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: 'bff-ms-gateway-user',
})
export class User extends Document implements IUserEntity {
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: 'string', enum: Role })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

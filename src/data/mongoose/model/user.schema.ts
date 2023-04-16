import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../domain/interfaces/others/role.interface';
import { correctDateNow } from '../../../shared/utils/correctDate';
import { IUserEntity } from '../../../domain/entity/user.entity';
import { environment } from 'src/main/config/environment';

export type UserDocument = User & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.user,
})
export class User extends Document implements IUserEntity {
  _id?: string;

  @Prop()
  name: string;

  @Prop({ unique: true })
  phone: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: 'string', enum: Role })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);

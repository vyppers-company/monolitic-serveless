import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { correctDateNow } from '../../../shared/utils/correctDate';
import {
  ICaracteristicas,
  IProfile,
  ITYPEUSER,
} from '../../../domain/entity/user.entity';
import { environment } from 'src/main/config/environment/environment';
import { ICategory } from 'src/domain/entity/category';

export type UserDocument = User & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.user,
})
export class User extends Document implements IProfile {
  _id?: string;

  @Prop()
  name?: string;

  @Prop({ default: false })
  fitToReceivePayment?: boolean;

  @Prop({ default: null })
  cpf?: string;

  @Prop({ default: null })
  paymentConfiguration?: string;

  @Prop()
  profileImage?: string;

  @Prop({ type: Array, default: [] })
  planConfiguration?: string[];

  @Prop()
  bio?: string;

  @Prop()
  phone?: string;

  @Prop({ unique: true })
  email?: string;

  @Prop()
  password?: string;

  @Prop({ unique: false })
  vypperId?: string;

  @Prop({ default: false })
  verified?: boolean;

  @Prop()
  birthday?: string;

  @Prop({ type: Object })
  caracteristics?: ICaracteristicas;

  @Prop()
  oauth2Partner?: string;

  @Prop({ default: true })
  termsAndConditions?: boolean;

  @Prop({ default: ITYPEUSER.USER })
  type: ITYPEUSER;

  @Prop({ type: Object })
  interests?: ICategory;

  @Prop({ type: Array, default: [] })
  bans?: string[];

  @Prop({ type: Array })
  followers?: string[];

  @Prop({ type: Boolean, default: false })
  isBanned?: boolean;

  @Prop({ type: Boolean, default: false })
  isFreezed?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

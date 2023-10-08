import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { correctDateNow } from '../../../shared/utils/correctDate';
import { IProfile } from '../../../domain/entity/user.entity';
import { environment } from 'src/main/config/environment';

export type UserDocument = User & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.user,
})
export class User extends Document implements IProfile {
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  phone?: string;

  @Prop({ unique: true })
  email?: string;

  @Prop()
  password?: string;

  @Prop({ unique: false })
  profileId?: string;

  @Prop()
  profileImage?: string;

  @Prop({ default: false })
  activated?: boolean;

  @Prop()
  birthday?: string;

  @Prop()
  gender?: string;

  @Prop()
  _idProfile?: string;

  @Prop()
  oauth2Partner?: string;

  @Prop({ default: true })
  termsAndConditions: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

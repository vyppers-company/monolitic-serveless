import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { correctDateNow } from '../../../shared/utils/correctDate';
import { environment } from 'src/main/config/environment/environment';
import { IInternalUser } from 'src/domain/entity/internal-users';
import { IHierarchy } from 'src/domain/entity/hierarchy';
import { IInternalRole } from 'src/domain/entity/internal-role';

export type InternalUserDocument = InternalUser & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.internalUser,
})
export class InternalUser extends Document implements IInternalUser {
  _id?: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop()
  cpf: string;

  @Prop()
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  profileImage?: string;

  @Prop({ type: Object })
  hierarchy?: IHierarchy;

  @Prop()
  birthday?: string;

  @Prop({ default: IInternalRole.DEFAULT })
  role?: IInternalRole;

  @Prop()
  createdBy?: string;

  @Prop()
  udpdatedBy?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const InternalUserSchema = SchemaFactory.createForClass(InternalUser);

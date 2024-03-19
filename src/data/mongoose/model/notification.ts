import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  INotificationMesssage,
  IPayloadNotification,
} from 'src/domain/entity/notification.entity';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';
import { Document } from 'mongoose';

export type NotificationMessageDocument = NotificationMessage & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.notifications,
})
export class NotificationMessage
  extends Document
  implements INotificationMesssage
{
  _id?: string;
  @Prop({ default: false, type: Boolean })
  isViewed?: boolean;
  @Prop({ type: Object })
  payload: IPayloadNotification;
  @Prop()
  sender: string;
  @Prop()
  receiver: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const NotificationMessageSchema =
  SchemaFactory.createForClass(NotificationMessage);

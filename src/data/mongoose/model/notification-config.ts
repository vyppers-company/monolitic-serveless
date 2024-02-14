import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IPushSubscription,
  NotificationConfigEntity,
} from 'src/domain/entity/notification.entity';
import { environment } from 'src/main/config/environment/environment';
import { correctDateNow } from 'src/shared/utils/correctDate';
import { Document } from 'mongoose';

export type NotificationConfigDocument = ConfigNotification & Document;

@Schema({
  timestamps: { currentTime: correctDateNow },
  collection: environment.mongodb.collections.configNotification,
})
export class ConfigNotification
  extends Document
  implements NotificationConfigEntity
{
  _id?: string;
  @Prop({ default: correctDateNow })
  permittedAt?: Date;
  @Prop({ type: Object })
  subscriptionKey: IPushSubscription;
  @Prop()
  owner: string;
  @Prop({ type: Boolean, default: true })
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const NotificationConfigSchema =
  SchemaFactory.createForClass(ConfigNotification);

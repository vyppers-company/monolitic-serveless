import {
  IPayloadNotification,
  IPushSubscription,
} from 'src/domain/entity/notification.entity';

export interface ISendNotiticationPayload {
  subscriber: IPushSubscription;
  payload: IPayloadNotification;
}
export interface INotificationAdapter {
  sendNotification: (payload: ISendNotiticationPayload) => Promise<void>;
}

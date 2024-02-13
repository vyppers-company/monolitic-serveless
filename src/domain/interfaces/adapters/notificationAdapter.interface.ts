export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
export interface IPayloadNotification {
  title: string;
  message: string;
  image: string | null;
  date: Date;
}
export interface ISendNotiticationPayload {
  subscriber: PushSubscription;
  paylad: IPayloadNotification;
}
export interface INotificationAdapter {
  sendNotification: (payload: ISendNotiticationPayload) => Promise<void>;
}

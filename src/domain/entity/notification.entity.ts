export interface IKeysPushSubscription {
  p256dh: string;
  auth: string;
}
export interface IPushSubscription {
  endpoint: string;
  keys: IKeysPushSubscription;
}
export interface IPayloadNotification {
  title: string;
  type: string;
  user: string;
  image: string | null;
  date: string;
}
export interface NotificationConfigEntity {
  permittedAt?: Date;
  subscriptionKey: IPushSubscription;
  owner: string;
  enabled?: boolean;
  dontShowAnymore?: boolean;
}

export interface INotificationMesssage {
  isViewed?: boolean;
  payload: IPayloadNotification;
  sender: string;
  receiver: string;
}

import {
  IPushSubscription,
  NotificationConfigEntity,
} from 'src/domain/entity/notification.entity';
export type NotificationConfigInterface = Pick<
  NotificationConfigEntity,
  'enabled' | 'dontShowAnymore'
>;

export interface IVapidNotificationService {
  savePermissionNotificationBrowser: (
    body: IPushSubscription,
    user: string,
  ) => Promise<void>;
  getUnread: (userId: string) => Promise<any[]>;
  markAsViewed: (userId: string, notificationId: string) => Promise<void>;
  setConfiguration: (
    myId: string,
    dto: NotificationConfigInterface,
  ) => Promise<void>;
}

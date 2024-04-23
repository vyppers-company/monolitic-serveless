import {
  INotificationMesssage,
  IPushSubscription,
  NotificationConfigEntity,
} from 'src/domain/entity/notification.entity';
import { PaginateResult } from 'mongoose';

export type NotificationConfigInterface = Pick<
  NotificationConfigEntity,
  'enabled' | 'dontShowAnymore'
>;
export enum ITypeNotification {
  'all' = 'all',
  'only_unread' = 'only_unread',
  'ony_read' = 'only_read',
}
export interface INotificationQueryParams {
  limit: number;
  page: number;
  type: ITypeNotification;
}
export interface IVapidNotificationService {
  savePermissionNotificationBrowser: (
    body: IPushSubscription,
    user: string,
  ) => Promise<void>;
  getUnread: (
    userId: string,
    queryParams: INotificationQueryParams,
  ) => Promise<PaginateResult<INotificationMesssage[]>>;
  markAsViewed: (userId: string, notificationId: string) => Promise<void>;
  setConfiguration: (
    myId: string,
    dto: NotificationConfigInterface,
  ) => Promise<void>;
}

import { IPushSubscription } from 'src/domain/entity/notification.entity';

export interface IVapidNotificationService {
  savePermissionNotificationBrowser: (
    body: IPushSubscription,
    user: string,
  ) => Promise<void>;
}

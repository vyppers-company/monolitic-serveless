import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IVapidNotificationService } from '../interfaces/usecases/vapid-notification.interface';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import {
  IPayloadNotification,
  IPushSubscription,
} from '../entity/notification.entity';
import { ConfigNotificationRepository } from 'src/data/mongoose/repositories/config-notification.repository';
import { NotificationAdapter } from 'src/infra/adapters/notification/notificationAdapter';
import { NotificationsMessageRepository } from 'src/data/mongoose/repositories/notification.repository';
import { correctDateNow } from 'src/shared/utils/correctDate';

@Injectable()
export class VapidNotificationService implements IVapidNotificationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configNotificationRepository: ConfigNotificationRepository,
    private readonly notificationAdapter: NotificationAdapter,
    private readonly notificationsMessage: NotificationsMessageRepository,
  ) {}
  async savePermissionNotificationBrowser(
    body: IPushSubscription,
    myId: string,
  ) {
    const user = await this.userRepository.findOne({
      _id: myId,
      isBanned: false,
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const configNotification = await this.configNotificationRepository.findOne({
      owner: user._id,
    });
    await this.configNotificationRepository.upsertOne(configNotification, {
      owner: myId,
      subscriptionKey: body,
      permittedAt: correctDateNow(),
    });
  }
  async sendNotification(
    payload: IPayloadNotification,
    myId: string,
    receiverId: string,
  ) {
    const notificationConfig = await this.configNotificationRepository.findOne({
      owner: myId,
    });
    await this.notificationsMessage.create({
      isViewed: false,
      receiver: receiverId,
      sender: myId,
      payload: payload,
    });
    await this.notificationAdapter.sendNotification({
      subscriber: notificationConfig.subscriptionKey,
      payload: payload,
    });
  }
}

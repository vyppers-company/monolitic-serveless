import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  INotificationQueryParams,
  ITypeNotification,
  IVapidNotificationService,
  NotificationConfigInterface,
} from '../interfaces/usecases/vapid-notification.interface';
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
    senderId: string,
    receiverId: string,
  ) {
    try {
      const notificationConfig =
        await this.configNotificationRepository.findOne({
          owner: receiverId,
        });
      if (notificationConfig && notificationConfig?.enabled) {
        await this.notificationsMessage.create({
          isViewed: false,
          receiver: receiverId,
          sender: senderId,
          payload: payload,
        });
        await this.notificationAdapter.sendNotification({
          subscriber: notificationConfig.subscriptionKey,
          payload: payload,
        });
      }
    } catch (error) {
      return error;
    }
  }

  async sendCampaign(user: any, campaignNotification: any) {
    this.notificationsMessage.create({
      isViewed: false,
      receiver: user.receiverId,
      sender: campaignNotification.senderId,
      payload: campaignNotification.payload,
    });
    this.notificationAdapter.sendNotification({
      subscriber: user.subscriptionKey,
      payload: campaignNotification.payload,
    });
  }
  async getUnread(userId: string, queryParams: INotificationQueryParams) {
    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) {
      throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    }

    const filter = {};
    if (queryParams.type !== ITypeNotification.all) {
      filter['isViewed'] =
        queryParams.type === ITypeNotification.only_unread ? false : true;
    }
    filter['receiver'] = userId;

    const result = await this.notificationsMessage.findPaginated(
      {
        sort: { createdAt: -1 },
        limit: Number(queryParams.limit),
        page: Number(queryParams.page),
      },
      { ...filter },
    );
    return {
      totalDocs: result.totalDocs,
      limit: result.limit,
      totalPages: result.totalPages,
      page: result.page,
      offset: result.offset,
      pagingCounter: result.pagingCounter,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      docs: result.docs,
    };
  }

  async markAsViewed(userId: string, notificationId: string) {
    await this.notificationsMessage.markAsViewed(userId, notificationId);
  }

  async setConfiguration(myId: string, dto: NotificationConfigInterface) {
    const user = await this.userRepository.findOne({
      _id: myId,
      isBanned: false,
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const configNotification = await this.configNotificationRepository.findOne(
      {
        owner: user._id,
      },
      null,
      { lean: true },
    );
    if (!configNotification) {
      throw new HttpException(
        'request permission before',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    await this.configNotificationRepository.notificationConfig(
      configNotification._id,
      dto,
    );
  }
}

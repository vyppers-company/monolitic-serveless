import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import {
  NotificationMessage,
  NotificationMessageDocument,
} from '../model/notification';

@Injectable()
export class NotificationsMessageRepository extends BaseAbstractRepository<NotificationMessageDocument> {
  constructor(
    @InjectModel(NotificationMessage.name)
    private readonly notificationMessage: BaseModel<NotificationMessageDocument>,
  ) {
    super(notificationMessage);
  }
  async markAsViewed(userId: string, notificationId: string) {
    return await this.notificationMessage.updateOne(
      {
        _id: notificationId,
        receiver: userId,
      },
      {
        $set: {
          isViewed: true,
        },
      },
    );
  }
}

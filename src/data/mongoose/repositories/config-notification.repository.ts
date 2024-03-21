import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import {
  NotificationConfigDocument,
  ConfigNotification,
} from '../model/notification-config';
import { NotificationConfigEntity } from 'src/domain/entity/notification.entity';
import { NotificationConfigInterface } from 'src/domain/interfaces/usecases/vapid-notification.interface';

@Injectable()
export class ConfigNotificationRepository extends BaseAbstractRepository<NotificationConfigDocument> {
  constructor(
    @InjectModel(ConfigNotification.name)
    private readonly configNotification: BaseModel<NotificationConfigDocument>,
  ) {
    super(configNotification);
  }
  async notificationConfig(notifyId: string, dto: NotificationConfigInterface) {
    /*    try { */
    await this.configNotification.updateOne(
      { _d: notifyId },
      {
        $set: {
          dontShowAnymore: dto.dontShowAnymore || false,
          enabled: dto.enabled || true,
        },
      },
      {
        upsert: true,
      },
    );
    /*   } catch (error) {
      throw new HttpException('Internal Server Error', error);
    } */
  }

  async upsertOne(
    oldDto: NotificationConfigEntity,
    newDto: NotificationConfigEntity,
  ) {
    await this.configNotification.updateOne(
      { owner: oldDto?.owner },
      {
        $set: {
          ...newDto,
        },
      },
      {
        upsert: true,
      },
    );
  }
}

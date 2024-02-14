import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ConfigNotificationRepository extends BaseAbstractRepository<NotificationConfigDocument> {
  constructor(
    @InjectModel(ConfigNotification.name)
    private readonly configNotification: BaseModel<NotificationConfigDocument>,
  ) {
    super(configNotification);
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

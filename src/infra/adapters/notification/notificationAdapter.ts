import { HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import {
  INotificationAdapter,
  ISendNotiticationPayload,
} from 'src/domain/interfaces/adapters/notificationAdapter.interface';
import * as webPush from 'web-push';

export class NotificationAdapter implements INotificationAdapter {
  private logger: Logger;
  constructor(
    @Inject('web_push') private readonly webPushProvider: typeof webPush,
  ) {
    this.logger = new Logger();
  }
  async sendNotification(payload: ISendNotiticationPayload): Promise<void> {
    try {
      await this.webPushProvider.sendNotification(
        payload.subscriber,
        JSON.stringify(payload.payload),
      );
    } catch (error) {
      Logger.error(
        new HttpException(
          `NotificationAdapter Error:${error}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        ),
      );
      return;
    }
  }
}

import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import {
  INotificationAdapter,
  ISendNotiticationPayload,
} from 'src/domain/interfaces/adapters/notificationAdapter.interface';
import * as webPush from 'web-push';

export class NotificationAdapter implements INotificationAdapter {
  constructor(
    @Inject('web_push') private readonly webPushProvider: typeof webPush,
  ) {}
  async sendNotification(payload: ISendNotiticationPayload): Promise<void> {
    try {
    } catch (error) {
      throw new HttpException(
        `NotificationAdapter Error:${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
    await this.webPushProvider.sendNotification(
      payload.subscriber,
      JSON.stringify(payload.paylad),
    );
  }
}

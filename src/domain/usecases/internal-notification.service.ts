import { Injectable } from '@nestjs/common';
import { ILoggedInternalUser } from '../interfaces/others/logged.interface';
import { VapidNotificationService } from './vapidNotification.service';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { EventBridgeAdapter } from 'src/infra/adapters/aws/eventbridge/event-bridge.adapter';
import { SQSAdapter } from 'src/infra/adapters/aws/sqs/sqs.adapter';

@Injectable()
export class InternalServiceNotification {
  constructor(
    private readonly campaignRepository: any,
    private readonly userRepository: UserRepository,
    private readonly eventBridgeAdapter: EventBridgeAdapter,
    private readonly sqsAdapter: SQSAdapter,
    private readonly vapidNotificationService: VapidNotificationService,
  ) {}
  async createCampaign(body: any, user: ILoggedInternalUser) {
    await this.eventBridgeAdapter.createSchedule({});
  }
  async campaignDispatcher() {
    await this.sqsAdapter.sendMessage({});
  }
}

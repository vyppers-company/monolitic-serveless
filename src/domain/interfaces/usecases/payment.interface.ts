import { ProcessSubscriptionDto } from 'src/presentation/dtos/subscription.dto';

export interface ISubscriptionsUseCases {
  processSubscription: (
    myId: string,
    dto: ProcessSubscriptionDto,
  ) => Promise<string>;
}

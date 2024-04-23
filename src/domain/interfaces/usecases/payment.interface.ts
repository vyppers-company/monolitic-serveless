import { PaginateResult } from 'mongoose';
import { IPlanEntity } from 'src/domain/entity/plan';
import { ProcessSubscriptionDto } from 'src/presentation/dtos/subscription.dto';

export interface ISubscriptionsUseCases {
  processSubscription: (
    myId: string,
    dto: ProcessSubscriptionDto,
  ) => Promise<{ message: string }>;
  getMySubscriptions: (
    limit: number,
    page: number,
    myId: string,
  ) => Promise<PaginateResult<IPlanEntity>>;
}

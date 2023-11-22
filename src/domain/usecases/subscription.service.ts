import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlanRepository } from 'src/data/mongoose/repositories/plan.repository';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { PaymentSubscriptionAdapter } from 'src/infra/adapters/payment/subscription/subscription.adapter';
import { ISubscriptionsUseCases } from '../interfaces/usecases/payment.interface';
import { ProcessSubscriptionDto } from 'src/presentation/dtos/subscription.dto';

@Injectable()
export class SubscriptionService implements ISubscriptionsUseCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly planRepository: PlanRepository,
    private readonly paymentAdapter: PaymentSubscriptionAdapter,
  ) {}
  async processSubscription(myId: string, dto: ProcessSubscriptionDto) {
    if (myId === dto.creatorVypperId) {
      throw new HttpException(
        {
          reason: 'SubscriptionError',
          message: 'creator and subscriber cant be the same',
        },
        HttpStatus.CONFLICT,
      );
    }

    const creator = await this.userRepository.findOne({
      _id: dto.creatorVypperId,
    });

    if (!creator) {
      throw new NotFoundException('creator not found');
    }
    const buyer = await this.userRepository.findOne({ _id: myId });
    if (!buyer) {
      throw new NotFoundException('creator not found');
    }
    if (!buyer?.paymentConfiguration?.paymentCustomerId) {
      throw new NotFoundException(
        'needs create one payment method before to assign subscription',
      );
    }

    const plan = await this.planRepository.findOneById(dto.creatorPlanId);

    if (!plan) {
      throw new NotFoundException('plan not found');
    }

    if (
      plan.subscribers.some(
        (item) => item.vypperSubscriptionId === String(buyer._id),
      )
    ) {
      const items = plan.subscribers.find(
        (item) => item.vypperSubscriptionId === String(buyer._id),
      );

      const existentSubs = await this.paymentAdapter.getSubscription(
        items.paymentSubscriptionId,
      );
      if (existentSubs && existentSubs.status === 'active') {
        throw new ConflictException(
          'this user have already assign this creator',
        );
      }

      const renewSubs = await this.paymentAdapter.createSubscription(
        plan.paymentPlanId,
        buyer.paymentConfiguration.paymentCustomerId,
        plan.currency,
      );

      await this.planRepository.addSubscriber(plan._id, {
        paymentSubscriptionId: renewSubs,
        vypperSubscriptionId: String(buyer._id),
      });
      return;
    }

    const newSubs = await this.paymentAdapter.createSubscription(
      plan.paymentPlanId,
      buyer.paymentConfiguration.paymentCustomerId,
      plan.currency,
    );

    await this.planRepository.addSubscriber(plan._id, {
      paymentSubscriptionId: newSubs,
      vypperSubscriptionId: String(buyer._id),
    });
    return 'Subscription Well Successfully';
  }
}

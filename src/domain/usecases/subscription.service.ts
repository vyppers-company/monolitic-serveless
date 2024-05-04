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
import { PaginateResult } from 'mongoose';
import { IPlanEntity } from '../entity/plan';
import { IPaymentConfiguration } from '../entity/payment';
import { TransactionRepository } from 'src/data/mongoose/repositories/transaction.repository';

@Injectable()
export class SubscriptionService implements ISubscriptionsUseCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly planRepository: PlanRepository,
    private readonly paymentAdapter: PaymentSubscriptionAdapter,
    private readonly transactionRepository: TransactionRepository,
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
      isBanned: false,
    });

    if (!creator) {
      throw new NotFoundException('creator not found');
    }
    const buyer = await this.userRepository.findOne(
      { _id: myId, isBanned: false },
      null,
      {
        lean: true,
        populate: [{ model: 'Payment', path: 'paymentConfiguration' }],
      },
    );

    if (!buyer) {
      throw new HttpException('user not found', 404);
    }

    const pay = buyer.paymentConfiguration as IPaymentConfiguration;

    if (!pay.customerId) {
      throw new NotFoundException(
        'needs create one payment method before to assign subscription',
      );
    }

    const plan = await this.planRepository.findOneById(dto.creatorPlanId);

    if (!plan) {
      throw new NotFoundException('plan not found');
    }
    if (plan.isDeleted || !plan.activate) {
      throw new HttpException(
        'This plan is closed for news subscribers',
        HttpStatus.UNAUTHORIZED,
      );
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
        pay.customerId,
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
      pay.customerId,
      plan.currency,
    );

    await this.planRepository.addSubscriber(plan._id, {
      paymentSubscriptionId: newSubs,
      vypperSubscriptionId: String(buyer._id),
    });

    await this.transactionRepository.create({
      buyer: myId,
      idTransactionAdapter: newSubs,
      plataformPercentage: 5, //needs to be transfer to entity
      sellerPercentage: 95, //needs to be transfer to entity
      planId: plan._id,
      seller: dto.creatorVypperId,
    });
    return { message: 'Subscription Well Successfully' };
  }

  async getMySubscriptions(
    limit: number,
    page: number,
    myId: string,
  ): Promise<PaginateResult<IPlanEntity>> {
    const result = await this.planRepository.findPaginated(
      {
        sort: { _id: -1 },
        limit: Number(limit),
        page: Number(page),
        populate: [
          {
            path: 'owner',
            model: 'User',
            select: 'vypperId name profileImage followers planConfiguration',
            populate: [
              {
                path: 'profileImage',
                model: 'Content',
                select: 'contents',
              },
            ],
          },
        ],
      },
      {
        subscribers: { $in: [myId] },
      },
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
      docs: result.docs.map((doc: any) => ({
        name: doc.name,
        _id: doc._id,
        price: doc.price,
        benefits: doc.benefits,
        activate: doc.activate,
        owner: {
          _id: doc.owner._id,
          name: doc.owner.name,
          vypperId: doc.owner.vypperId,
          profileImage: doc.owner.profileImage,
        },
      })),
    };
  }
  async processPaymentSubscriptionFailedWebhook(param: any) {
    return;
  }
}

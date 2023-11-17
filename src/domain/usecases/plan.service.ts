import { PlanRepository } from 'src/data/mongoose/repositories/plan.repository';
import { IPlanEntity, IPlanEntityExtendedResponse } from '../entity/plan';
import { PlanUseCase } from '../interfaces/usecases/plan.interface';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { PaymentPlanAdapter } from 'src/infra/adapters/payment/plan/plan.adapter';
import { ICurrency } from '../entity/currency';
import { EditPlanDto } from 'src/presentation/dtos/plan-dto';
import { PaymentSubscriptionAdapter } from 'src/infra/adapters/payment/subscription/subscription.adapter';

@Injectable()
export class PlanService implements PlanUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly userRepository: UserRepository,
    private readonly paymentPlanAdapter: PaymentPlanAdapter,
    private readonly paymentSubscriptionAdapter: PaymentSubscriptionAdapter,
  ) {}

  async createPlan(myId: string, dto: IPlanEntity): Promise<void> {
    const result = await this.planRepository.find({ owner: myId });

    if (result.length >= 3) {
      throw new ConflictException(`you only can have 3 plans`);
    }
    const paymentPlanId = await this.paymentPlanAdapter.createPlan(myId, {
      ...dto,
      currency: ICurrency.BRL,
    });
    const resultCreated = await this.planRepository.create({
      ...dto,
      owner: myId,
      currency: ICurrency.BRL,
      paymentPlanId,
    });
    await this.userRepository.addPlan(myId, resultCreated._id);
  }

  async deletePlan(myId: string, planId: string): Promise<void> {
    const plan = await this.planRepository.findOne({
      _id: planId,
      owner: myId,
    });
    if (!plan) {
      throw new NotFoundException('plan not found');
    }
    const hasSubscribers =
      await this.paymentSubscriptionAdapter.verifyIfHasSubsByPlan(
        plan.paymentPlanId,
      );
    if (hasSubscribers) {
      throw new HttpException(
        {
          reason: 'SubscriptionError',
          message: "this plan has activated subscribers, you can't remove",
        },
        HttpStatus.FORBIDDEN,
      );
    }
    await this.paymentPlanAdapter.deletePlan(plan.paymentPlanId);
    await this.userRepository.removePlan(myId, planId);
    await this.planRepository.deleteById(plan._id);
    return;
  }

  async editPlan(
    planId: string,
    myId: string,
    dto: EditPlanDto,
  ): Promise<void> {
    const plan = await this.planRepository.findOne({
      _id: planId,
      owner: myId,
    });
    if (!plan) {
      throw new NotFoundException('plan not found');
    }

    await this.paymentPlanAdapter.editPlan(plan);
    await this.planRepository.updatePlan(planId, dto, myId);
  }

  async getPlans(
    myId: string,
    userId: string,
    resumed: boolean,
  ): Promise<IPlanEntity[] | Pick<IPlanEntity, '_id' | 'name'>[]> {
    if (resumed) {
      const plans = await this.planRepository.find({
        owner: userId,
      });
      return plans.map((plan) => ({ _id: plan._id, name: plan.name }));
    }
    const plans = await this.planRepository.findWithRelations(
      {
        owner: userId,
      },
      [
        {
          path: 'subscribers.vypperSubscriptionId',
          model: 'User',
          select: 'name _id vypperId profileImage',
          populate: {
            path: 'profileImage',
            model: 'Content',
            select: 'contents',
          },
        },
      ],
      null,
      null,
    );
    return plans.map(
      ({
        activate,
        name,
        price,
        benefits,
        owner,
        _id,
        currency,
        subscribers,
        createdAt,
        updatedAt,
      }) => ({
        _id,
        owner,
        name,
        price,
        activate,
        benefits,
        currency,
        canEdit: String(userId) === String(userId) ? true : false,
        subscribers:
          String(myId) === String(userId)
            ? subscribers.map((item) => ({
                vypperSubscriptionId: item.vypperSubscriptionId,
              }))
            : [],
        createdAt,
        updatedAt,
      }),
    );
  }

  async getPlan(
    planId: string,
    userId: string,
  ): Promise<IPlanEntityExtendedResponse> {
    const plan = await this.planRepository.findOneById(planId);
    if (!plan) {
      throw new HttpException(
        { message: 'Plan not found', reason: 'PlanError' },
        HttpStatus.NOT_FOUND,
      );
    }
    const {
      _id,
      owner,
      name,
      price,
      activate,
      benefits,
      currency,
      subscribers,
      createdAt,
      updatedAt,
    } = plan;
    return {
      _id,
      owner,
      name,
      price,
      activate,
      benefits,
      currency,
      subscribers:
        String(userId) === String(plan.owner)
          ? subscribers.map((item) => ({
              vypperSubscriptionId: item.vypperSubscriptionId,
            }))
          : [],
      canEdit: String(userId) === String(plan.owner) ? true : false,
      createdAt,
      updatedAt,
    };
  }
}

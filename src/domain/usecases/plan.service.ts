import { PlanRepository } from 'src/data/mongoose/repositories/plan.repository';
import {
  IPlanEntity,
  IPlanEntityExtendedResponse,
  percentageValues,
} from '../entity/plan';
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
    const result = await this.planRepository.find({
      owner: myId,
      activate: true,
    });

    if (dto.isAnnual === true && !dto.annualPercentage) {
      throw new HttpException(
        'percentage is required when isAnull is true',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      dto.isAnnual === true &&
      !percentageValues.includes(dto.annualPercentage)
    ) {
      throw new HttpException(
        `invalid percentage value: valid values ${percentageValues.map(
          (item) => `${item * 100}%`,
        )}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (result.length >= 3) {
      throw new ConflictException(`you only can have 3 plans`);
    }
    const paymentPlanId = await this.paymentPlanAdapter.createPlan(myId, {
      ...dto,
      currency: ICurrency.BRL,
    });

    const paymentPlanIdAnnual =
      dto.isAnnual &&
      (await this.paymentPlanAdapter.createAnnualPlan(myId, {
        ...dto,
        name: `${dto.name} - Annual`,
        currency: ICurrency.BRL,
      }));

    const resultCreated = await this.planRepository.create({
      ...dto,
      owner: myId,
      currency: ICurrency.BRL,
      paymentPlanId,
      paymentPlanIdAnnual,
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
    if (plan.isAnnual === true) {
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
      await this.paymentPlanAdapter.deletePlan(plan.paymentPlanIdAnnual);
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
    const plans = await this.planRepository.find({
      owner: myId,
    });

    dto.isAnnual = dto.activate === false ? false : dto.isAnnual;

    const plan = plans.find((pl) => String(pl._id) === planId);

    if (!plan) {
      throw new NotFoundException('plan not found');
    }

    const activatedPlans = plans.filter((pl) => pl.activate === true);

    if (activatedPlans.length >= 3 && dto.activate === true) {
      throw new NotFoundException(
        'You cant have more than 3 plans activated, please deactive some plan before',
      );
    }

    await this.paymentPlanAdapter.editPlan({
      paymentPlanId: plan.paymentPlanId,
      owner: plan.owner,
      activate: dto.activate ?? plan.activate,
      name: dto.name || plan.name,
      benefits: dto.benefits || plan.benefits,
    });
    if (
      plan.paymentPlanIdAnnual &&
      (dto.isAnnual !== null || dto.isAnnual !== undefined)
    ) {
      await this.paymentPlanAdapter.editPlan({
        owner: plan.owner,
        paymentPlanId: plan.paymentPlanIdAnnual,
        activate: dto.isAnnual,
        name: `${dto.name} - Annual` || `${plan.name} - Annual`,
        benefits: dto.benefits || plan.benefits,
      });
    }
    await this.planRepository.updatePlan(planId, dto, myId);
  }

  async getPlans(
    activated: boolean,
    myId: string,
    userId: string,
    resumed: boolean,
  ): Promise<IPlanEntity[] | Pick<IPlanEntity, '_id' | 'name'>[]> {
    if (resumed) {
      if (myId !== userId) {
        throw new HttpException(
          'this mode was design just for your own plans',
          HttpStatus.FORBIDDEN,
        );
      }
      const plans = await this.planRepository.find({
        owner: userId,
        activate: true,
      });
      return plans.map((plan) => ({ _id: plan._id, name: plan.name }));
    }

    const finalDto = { owner: userId };
    if (activated) {
      finalDto['activate'] = activated;
    }

    const plans = await this.planRepository.findWithRelations(
      finalDto,
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
        isAnnual,
        annualPercentage,
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
        isAnnual,
        annualPercentage,
        annualPrice: isAnnual ? price * (1 - annualPercentage) * 12 : 0,
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
    activated: boolean,
    planId: string,
    userId: string,
  ): Promise<IPlanEntityExtendedResponse> {
    const finalDto = { _id: planId };
    if (activated) {
      finalDto['activate'] = activated;
    }
    const plan = await this.planRepository.findOne(finalDto, null, {
      populate: [
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
    });
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
      isAnnual,
      annualPercentage,
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
      isAnnual,
      annualPercentage,
      annualPrice: isAnnual ? price * (1 - annualPercentage) * 12 : 0,
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

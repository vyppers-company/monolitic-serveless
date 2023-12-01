import { HttpException, Inject, Injectable } from '@nestjs/common';
import { IPlanEntity } from 'src/domain/entity/plan';
import { IPaymentPlanUseCases } from 'src/domain/interfaces/adapters/payment-plan.interface';
import Stripe from 'stripe';

@Injectable()
export class PaymentPlanAdapter implements IPaymentPlanUseCases {
  constructor(@Inject('stripe') private readonly stripe: Stripe) {}

  async createPlan(myId: string, dto: IPlanEntity): Promise<string> {
    try {
      const plan = await this.stripe.plans.create({
        currency: dto.currency,
        interval: 'month',
        active: dto.activate,
        amount: dto.price,
        billing_scheme: 'per_unit',
        nickname: dto.name,
        metadata: {
          owner: myId,
          benefits: dto.benefits.toString(),
        },
        product: {
          name: dto.name,
        },
      });
      return plan.id;
    } catch (error) {
      throw new HttpException('Failed Dependency', 422, error);
    }
  }
  async createAnnualPlan(myId: string, dto: IPlanEntity): Promise<string> {
    try {
      const plan = await this.stripe.plans.create({
        currency: dto.currency,
        interval: 'year',
        active: dto.activate,
        amount: dto.price * dto.annualPercentage * 12,
        billing_scheme: 'per_unit',
        nickname: dto.name,
        metadata: {
          owner: myId,
          benefits: dto.benefits.toString(),
        },
        product: {
          name: `${dto.name} - Annual`,
        },
      });
      return plan.id;
    } catch (error) {
      throw new HttpException('Failed Dependency', 422, error);
    }
  }
  async deletePlan(planId: string): Promise<void> {
    await this.stripe.plans.del(planId);
  }

  async editPlan(
    dto: Pick<
      IPlanEntity,
      'benefits' | 'name' | 'owner' | 'paymentPlanId' | 'activate'
    >,
  ): Promise<void> {
    await this.stripe.plans.update(dto.paymentPlanId, {
      nickname: dto.name,
      active: dto.activate,
      metadata: {
        owner: dto.owner,
      },
    });
  }
}

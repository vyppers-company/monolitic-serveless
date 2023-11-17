import { IPlanEntity } from 'src/domain/entity/plan';

export interface IPaymentPlanUseCases {
  createPlan(myId: string, dto: IPlanEntity): Promise<string>;
  editPlan(
    dto: Pick<IPlanEntity, 'benefits' | 'name' | 'owner' | 'paymentPlanId'>,
  ): Promise<void>;
  deletePlan(planId: string): Promise<void>;
}

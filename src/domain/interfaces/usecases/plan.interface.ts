import { IPlanEntity } from 'src/domain/entity/payment-plan';

export type IPlanDto = IPlanEntity;

export interface PlanUseCase {
  createPlan(myId: string, dto: IPlanEntity): Promise<void>;
  getPlans(userId: string): Promise<IPlanEntity[]>;
  getPlan(userId: string, playId?: string): Promise<IPlanEntity>;
  editPlan(planId: string, userId: string, dto: IPlanEntity): Promise<void>;
  deletePlan(myId: string, planId: string): Promise<void>;
}

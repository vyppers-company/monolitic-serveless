import { IPlanEntity } from 'src/domain/entity/plan';

export type IPlanDto = IPlanEntity;

export interface PlanUseCase {
  createPlan(myId: string, dto: IPlanEntity): Promise<void>;
  getPlans(
    myId: string,
    userId: string,
    resumed: boolean,
  ): Promise<IPlanEntity[] | Pick<IPlanEntity, '_id' | 'name'>[]>;
  getPlan(userId: string, playId?: string): Promise<IPlanEntity>;
  deletePlan(myId: string, planId: string): Promise<void>;
}

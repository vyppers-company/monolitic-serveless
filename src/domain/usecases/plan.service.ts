import { PlanRepository } from 'src/data/mongoose/repositories/plan.repository';
import { IPlanEntity } from '../entity/payment-plan';
import { PlanUseCase } from '../interfaces/usecases/plan.interface';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';

@Injectable()
export class PlanService implements PlanUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createPlan(myId: string, dto: IPlanEntity): Promise<void> {
    const result = await this.planRepository.find({ owner: myId });

    if (result.length >= 3) {
      throw new ConflictException(`you only can have 3 plans`);
    }
    const resultCreated = await this.planRepository.create({
      ...dto,
      owner: myId,
    });
    await this.userRepository.addPlan(myId, resultCreated._id);
  }

  async deletePlan(myId: string, planId: string): Promise<void> {
    const plan = await this.planRepository.findOne({
      _id: planId,
      owner: myId,
    });
    if (plan) {
      await this.userRepository.removePlan(myId, planId);
      await this.planRepository.deleteById(plan._id);
      return;
    }
    throw new NotFoundException('plan not found');
  }

  async editPlan(
    planId: string,
    myId: string,
    dto: IPlanEntity,
  ): Promise<void> {
    const plans = await this.planRepository.findOne({
      _id: planId,
      owner: myId,
    });
    if (!plans) {
      throw new NotFoundException('plan not found');
    }

    await this.planRepository.updatePlan(planId, { ...dto, owner: myId });
  }

  async getPlans(userId: string): Promise<IPlanEntity[]> {
    return this.planRepository.find({ owner: userId });
  }
  async getPlan(userId: string, planId?: string): Promise<IPlanEntity> {
    return this.planRepository.findOne({
      _id: planId,
      owner: userId,
    });
  }
}

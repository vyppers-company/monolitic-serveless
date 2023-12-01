import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { Plan, PlanDocument } from '../model/plan.schema';
import { IPlanSubscribers } from 'src/domain/entity/plan';
import { EditPlanDto } from 'src/presentation/dtos/plan-dto';

@Injectable()
export class PlanRepository extends BaseAbstractRepository<PlanDocument> {
  constructor(
    @InjectModel(Plan.name)
    private readonly plan: BaseModel<PlanDocument>,
  ) {
    super(plan);
  }

  async updatePlan(planId: any, dto: EditPlanDto, owner: string) {
    await this.plan.updateOne(
      { _id: planId, owner },
      {
        $set: {
          ...dto,
        },
      },
    );
  }
  async addSubscriber(planId: string, dto: IPlanSubscribers) {
    await this.plan.updateOne(
      { _id: planId },
      {
        $push: {
          subscribers: dto,
        },
      },
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { IPlanDto } from 'src/domain/interfaces/usecases/plan.interface';
import { Plan, PlanDocument } from '../model/plan.schema';

@Injectable()
export class PlanRepository extends BaseAbstractRepository<PlanDocument> {
  constructor(
    @InjectModel(Plan.name)
    private readonly plan: BaseModel<PlanDocument>,
  ) {
    super(plan);
  }

  async updatePlan(planId: any, dto: IPlanDto) {
    const { description, name, price, owner } = dto;
    await this.plan.updateOne(
      { _id: planId, owner },
      {
        $set: {
          description,
          name,
          price,
        },
      },
    );
  }
}

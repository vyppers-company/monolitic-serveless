import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { DenunciateDocument, Denunciate } from '../model/denunciate.schema';
import { IVerifyDenuncianteTicketDto } from 'src/domain/interfaces/usecases/denunciate-internal.interface';
import { IStatusDenunciate } from 'src/domain/entity/denunciate';

@Injectable()
export class DenunciateRepository extends BaseAbstractRepository<DenunciateDocument> {
  constructor(
    @InjectModel(Denunciate.name)
    private readonly denunciate: BaseModel<DenunciateDocument>,
  ) {
    super(denunciate);
  }
  async updateStatus(dto: IVerifyDenuncianteTicketDto, ticketId: string) {
    return await this.denunciate.updateOne(
      {
        _id: ticketId,
      },
      {
        $set: {
          reviewedBy: dto.reviewerId,
          excludeContent: dto.excludeContent,
          decisionToBanUser: dto.decisionToBanUser,
          decisionReason: dto.decisionReason,
          status: IStatusDenunciate.CLOSED,
        },
      },
    );
  }
}

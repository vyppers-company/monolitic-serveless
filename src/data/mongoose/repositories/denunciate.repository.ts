import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { DenunciateDocument, Denunciate } from '../model/denunciate.schema';

@Injectable()
export class DenunciateRepository extends BaseAbstractRepository<DenunciateDocument> {
  constructor(
    @InjectModel(Denunciate.name)
    private readonly denunciate: BaseModel<DenunciateDocument>,
  ) {
    super(denunciate);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICodeEntity } from '../../../domain/entity/code.entity';

import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { Code, CodeDocument } from '../model/code.schema';

@Injectable()
export class CodeRepository extends BaseAbstractRepository<CodeDocument> {
  constructor(
    @InjectModel(Code.name)
    private readonly code: BaseModel<CodeDocument>,
  ) {
    super(code);
  }

  async upsertOne(id: string, dto: ICodeEntity) {
    await this.code.updateOne(
      { _id: id },
      {
        $set: {
          ...dto,
        },
      },
      {
        upsert: true,
      },
    );
  }
}

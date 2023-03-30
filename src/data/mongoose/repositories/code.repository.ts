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

  async upsertOne(oldDto: ICodeEntity, newDto: ICodeEntity) {
    await this.code.updateOne(
      { owner: oldDto?.owner },
      {
        $set: {
          ...newDto,
        },
      },
      {
        upsert: true,
      },
    );
  }
}

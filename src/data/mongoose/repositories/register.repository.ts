import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { BffMsRegister, BffMsRegisterDocument } from '../model/register.schema';

@Injectable()
export class UsersRepository extends BaseAbstractRepository<BffMsRegisterDocument> {
  constructor(
    @InjectModel(BffMsRegister.name)
    private readonly bffMsRegisterModel: BaseModel<BffMsRegisterDocument>,
  ) {
    super(bffMsRegisterModel);
  }
}

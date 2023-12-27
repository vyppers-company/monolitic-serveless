import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { InternalUser, InternalUserDocument } from '../model/internal-users';

@Injectable()
export class InternalUserRepository extends BaseAbstractRepository<InternalUserDocument> {
  constructor(
    @InjectModel(InternalUser.name)
    private readonly user: BaseModel<InternalUserDocument>,
  ) {
    super(user);
  }
}

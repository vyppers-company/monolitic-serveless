import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IAccess } from '../../../domain/entity/user.entity';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { User, UserDocument } from '../model/user.schema';

@Injectable()
export class UserRepository extends BaseAbstractRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private readonly user: BaseModel<UserDocument>,
  ) {
    super(user);
  }

  async updateOne(dto: IAccess, password: string) {
    await this.user.updateOne(
      { _id: dto?._id },
      {
        $set: {
          password,
        },
      },
    );
  }
}

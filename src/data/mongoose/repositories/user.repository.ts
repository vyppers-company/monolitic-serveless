import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IProfile } from '../../../domain/entity/user.entity';
import {
  BaseAbstractRepository,
  BaseModel,
} from '../helpers/base.abstract.repository';
import { User, UserDocument } from '../model/user.schema';
import { ProfileDto } from 'src/presentation/dtos/profile.dto';

@Injectable()
export class UserRepository extends BaseAbstractRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private readonly user: BaseModel<UserDocument>,
  ) {
    super(user);
  }
  async updateOnePassword(dto: IProfile, password: string) {
    await this.user.updateOne(
      { _id: dto?._id },
      {
        $set: {
          password: password,
        },
      },
    );
  }
  async updateProfileImage(myId: any, profileImage: string) {
    await this.user.updateOne(
      { _id: myId },
      {
        $set: {
          profileImage: profileImage,
        },
      },
    );
  }

  async updateProfileData(myId: any, data: ProfileDto) {
    await this.user.updateOne(
      { _id: myId },
      {
        $set: {
          ...data,
        },
      },
    );
  }

  async addBannedPerson(userId: string, myId: string) {
    await this.user.updateOne(
      { _id: myId },
      {
        $push: {
          bans: userId,
        },
      },
    );
  }

  async removeBannedPerson(userId: string, myId: string) {
    await this.user.updateOne(
      { _id: myId },
      {
        $pull: {
          bans: userId,
        },
      },
    );
  }

  async addFollower(userId: string, myId: string) {
    await this.user.updateOne(
      { _id: userId },
      {
        $push: {
          followers: myId,
        },
      },
    );
  }

  async removeFollower(userId: string, myId: string) {
    await this.user.updateOne(
      { _id: userId },
      {
        $pull: {
          followers: myId,
        },
      },
    );
  }
}

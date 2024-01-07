import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ICreateLiveChannelResponse,
  ICreateLiveChannelResponseRealTime,
  ICreateLivechannelInput,
  ICreateRoomUseCase,
  IInviteUserLiveStreamServiceDto,
} from '../interfaces/usecases/create-room.interface';
import { PlanRepository } from 'src/data/mongoose/repositories/plan.repository';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IVSAdapter } from 'src/infra/adapters/aws/ivs/ivs.adapter';
import { PlanDocument } from 'src/data/mongoose/model/plan.schema';
import { InviteUserLiveStreamDto } from 'src/presentation/dtos/livestream.dto';

@Injectable()
export class CreateRoomLiveService implements ICreateRoomUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly userRepository: UserRepository,
    private readonly liveChannelAdapter: IVSAdapter,
  ) {}

  async createLiveChannel(
    dto: ICreateLivechannelInput,
  ): Promise<ICreateLiveChannelResponse> {
    if (dto.isPrivate === true && !dto.plansId?.length) {
      throw new HttpException('private room needs a plan', HttpStatus.CONFLICT);
    }
    if (dto.isPrivate === false && dto.plansId?.length) {
      throw new HttpException(
        'public room dont needs a plan',
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.userRepository.findOne({ _id: dto.creatorId });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const plans = dto.isPrivate
      ? await this.planRepository.find({ $in: dto.plansId })
      : [];

    const authorizedUsers = plans.reduce(
      (acc: string[], curr: PlanDocument) => {
        curr.subscribers.forEach((subs) => {
          if (!acc.find((sub: string) => sub === subs.vypperSubscriptionId)) {
            acc.push(subs.vypperSubscriptionId);
          }
        });
        return acc;
      },
      [],
    );

    const channel = await this.liveChannelAdapter.createLiveChannel({
      isPrivate: dto.isPrivate,
      keepRecord: dto.keepRecord,
      creatorId: dto.creatorId,
      vypperId: user.vypperId,
      authorizedUsers,
      title: dto.title,
    });

    return channel;
  }
  async createLiveChannelRealTime(
    dto: ICreateLivechannelInput,
  ): Promise<ICreateLiveChannelResponseRealTime> {
    if (dto.isPrivate === true && !dto.plansId?.length) {
      throw new HttpException('private room needs a plan', HttpStatus.CONFLICT);
    }
    if (dto.isPrivate === false && dto.plansId?.length) {
      throw new HttpException(
        'public room dont needs a plan',
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.userRepository.findOne({ _id: dto.creatorId });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const plans = dto.isPrivate
      ? await this.planRepository.find({ $in: dto.plansId })
      : [];

    const authorizedUsers = plans.reduce(
      (acc: string[], curr: PlanDocument) => {
        curr.subscribers.forEach((subs) => {
          if (!acc.find((sub: string) => sub === subs.vypperSubscriptionId)) {
            acc.push(subs.vypperSubscriptionId);
          }
        });
        return acc;
      },
      [],
    );

    const channel = await this.liveChannelAdapter.createLiveChannelRealTime({
      isPrivate: dto.isPrivate,
      keepRecord: dto.keepRecord,
      creatorId: dto.creatorId,
      vypperId: user.vypperId,
      authorizedUsers,
      title: dto.title,
    });

    return channel;
  }
  async inviteUserLiveStream(dto: IInviteUserLiveStreamServiceDto) {
    const user = await this.userRepository.findOne({ _id: dto.inviterId });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const users = await this.userRepository.find({
      $in: dto.invites.map((user) => user.userId),
    });

    const mappedUsers = dto.invites
      .map((user) => {
        const findedName = users.find(
          (us) => String(us._id) === user.userId,
        ).vypperId;

        if (findedName) {
          return { ...user, userName: findedName };
        }
        return null;
      })
      .filter((user) => user !== null && user !== undefined);

    return await this.liveChannelAdapter.createInvites({
      ...dto,
      invites: mappedUsers,
    });
  }
}

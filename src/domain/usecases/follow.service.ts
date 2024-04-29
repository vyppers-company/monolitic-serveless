import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IFollowUseCase } from '../interfaces/usecases/follow.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { VapidNotificationService } from './vapid-notification.service';
import { correctDateNow } from 'src/shared/utils/correctDate';
import { IContentEntity } from '../entity/contents';

@Injectable()
export class FollowService implements IFollowUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly vapidNotificationService: VapidNotificationService,
  ) {}
  async makeFollow(myId: string, userId: string): Promise<void> {
    const otherUser = await this.userRepository.findOne({
      _id: userId,
      isBanned: false,
    });
    if (!otherUser) {
      throw new HttpException(
        {
          message: 'User not found',
          reason: 'FollowError',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (myId === userId) {
      throw new HttpException(
        {
          message: "You can't follow yourself",
          reason: 'FollowError',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (otherUser.bans && otherUser.bans.length) {
      if (otherUser.bans.includes(myId)) {
        throw new HttpException(
          {
            message: 'you are banned by this user',
            reason: 'FollowError',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const myUser = await this.userRepository.findOne(
      {
        _id: myId,
        isBanned: false,
      },
      null,
      {
        populate: [
          { path: 'profileImage', model: 'Content', select: 'contents' },
        ],
      },
    );

    const myProfileImage = myUser.profileImage as IContentEntity;
    if (otherUser.followers && otherUser.followers.length) {
      if (otherUser.followers.includes(myId)) {
        await this.userRepository.removeFollower(userId, myId);
        await this.vapidNotificationService.sendNotification(
          {
            date: correctDateNow().toISOString(),
            title: `nova notificação`,
            username: myUser.vypperId || 'null',
            image: myProfileImage ? myProfileImage?.contents[0].content : null,
            type: `FOLLOW`,
          },
          myId,
          otherUser._id,
        );
        return;
      }
    }

    await this.userRepository.addFollower(userId, myId);
    await this.vapidNotificationService.sendNotification(
      {
        date: correctDateNow().toISOString(),
        title: `nova notificação`,
        username: myUser.vypperId || 'null',
        image: myProfileImage ? myProfileImage?.contents[0].content : null,
        type: `UNFOLLOW`,
      },
      myId,
      otherUser._id,
    );
  }
}

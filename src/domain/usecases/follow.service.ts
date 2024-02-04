import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IFollowUseCase } from '../interfaces/usecases/follow.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class FollowService implements IFollowUseCase {
  constructor(private readonly userRepository: UserRepository) {}
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
    if (otherUser.followers && otherUser.followers.length) {
      if (otherUser.followers.includes(myId)) {
        await this.userRepository.removeFollower(userId, myId);
        return;
      }
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

    await this.userRepository.addFollower(userId, myId);
  }
}

import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IFollowUseCase } from '../interfaces/usecases/follow.interface';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class FollowService implements IFollowUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async makeFollow(myId: string, userId: string): Promise<void> {
    const otherUser = await this.userRepository.findOne({ _id: userId });
    if (!otherUser) {
      throw new NotFoundException('user not found');
    }
    if (otherUser.followers && otherUser.followers.length) {
      if (otherUser.followers.includes(myId)) {
        await this.userRepository.removeFollower(userId, myId);
        return;
      }
    }
    if (otherUser.bans && otherUser.bans.length) {
      if (otherUser.bans.includes(myId)) {
        throw new ConflictException('you are banned by this user');
      }
    }

    await this.userRepository.addFollower(userId, myId);
  }
}

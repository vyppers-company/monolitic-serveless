import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IProfile } from '../entity/user.entity';
import {
  IBanUserUseCase,
  IBannedQuery,
} from '../interfaces/usecases/ban-user.interface';
import { PaginateResult, isValidObjectId } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class BanUserService implements IBanUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async listBannedUser(
    myId: string,
    queries: IBannedQuery,
  ): Promise<PaginateResult<IProfile> | []> {
    const user = await this.userRepository.findOne({ _id: myId });

    const filter = {};

    if (user.bans && user.bans.length) {
      filter['_id'] = { $in: user.bans };
    }
    const result = user.bans.length
      ? await this.userRepository.findPaginated(
          {
            limit: Number(queries.limit) || 10,
            page: Number(queries.page) || 1,
          },
          filter,
        )
      : null;

    return result
      ? {
          totalDocs: result.totalDocs,
          limit: result.limit,
          totalPages: result.totalPages,
          page: result.page,
          offset: result.offset,
          pagingCounter: result.pagingCounter,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevPage: result.prevPage,
          nextPage: result.nextPage,
          docs: result.docs.map((doc: any) => ({
            vypperId: doc.vypperId,
            name: doc.name,
            profileImage: doc.profileImage,
            _id: doc._id,
          })),
        }
      : [];
  }
  async banUser(userId: string, myId: string): Promise<void> {
    const isValid = isValidObjectId(userId);
    if (!isValid) {
      throw new HttpException(
        { message: 'user to ban not found', reason: 'BannedUser' },
        HttpStatus.NOT_FOUND,
      );
    }
    const user = await this.userRepository.findOne({ _id: myId });
    const userToBan = await this.userRepository.findOne({ _id: userId });

    if (!userToBan) {
      throw new HttpException(
        { message: 'user to ban not found', reason: 'BannedUser' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (userId === myId) {
      throw new HttpException(
        { message: "You can't ban yourself", reason: 'BannedUser' },
        HttpStatus.CONFLICT,
      );
    }

    if (user.bans && user.bans.length && user.bans.includes(userId)) {
      throw new HttpException(
        { message: 'This user have already banned', reason: 'BannedUser' },
        HttpStatus.CONFLICT,
      );
    }

    await this.userRepository.addBannedPerson(userId, myId);
    await this.userRepository.removeFollower(myId, userId);
    await this.userRepository.removeFollower(userId, myId);
  }
  async unbanUser(userId: string, myId: string): Promise<void> {
    const isValid = isValidObjectId(userId);
    if (!isValid) {
      throw new HttpException(
        { message: 'user to ban not found', reason: 'BannedUser' },
        HttpStatus.NOT_FOUND,
      );
    }
    const userToBan = await this.userRepository.findOne({ _id: userId });
    if (!userToBan) {
      throw new HttpException(
        { message: 'user to ban not found', reason: 'BannedUser' },
        HttpStatus.NOT_FOUND,
      );
    }
    if (userId === myId) {
      throw new HttpException(
        { message: "You can't ban yourself", reason: 'BannedUser' },
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.userRepository.findOne({ _id: myId });
    if (user.bans && user.bans.length && !user.bans.includes(userId)) {
      throw new HttpException(
        { message: "This user haven't ever banned", reason: 'BannedUser' },
        HttpStatus.CONFLICT,
      );
    }

    await this.userRepository.removeBannedPerson(userId, myId);
  }
}

import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IProfile } from '../entity/user.entity';
import {
  IBanUserUseCase,
  IBannedQuery,
} from '../interfaces/usecases/ban-user.interface';
import { PaginateResult } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';

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
            vypperID: doc.vypperID,
            name: doc.name,
            profileImage: doc.profileImage,
            _id: doc._id,
          })),
        }
      : [];
  }
  async banUser(userId: string, myId: string): Promise<void> {
    const user = await this.userRepository.findOne({ _id: myId });
    if (user.bans && user.bans.length && user.bans.includes(userId)) {
      throw new ConflictException('this user have already banned');
    }
    if (userId === myId) {
      throw new ConflictException('you cant ban yourself');
    }
    await this.userRepository.addBannedPerson(userId, myId);
  }
  async unbanUser(userId: string, myId: string): Promise<void> {
    const user = await this.userRepository.findOne({ _id: myId });
    if (user.bans && user.bans.length && !user.bans.includes(userId)) {
      throw new ConflictException('this user have already not banned');
    }
    if (userId === myId) {
      throw new ConflictException('you cant ban yourself');
    }
    await this.userRepository.removeBannedPerson(userId, myId);
  }
}

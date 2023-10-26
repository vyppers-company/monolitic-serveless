import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IProfile } from '../entity/user.entity';
import { ISearchUseCase } from '../interfaces/usecases/search.interface';
import { PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchUsersService implements ISearchUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async searchUser(
    value: string,
    limit: number,
    page: number,
  ): Promise<PaginateResult<IProfile>> {
    const result = await this.userRepository.findPaginated(
      {
        limit: Number(limit),
        page: Number(page),
        populate: [
          {
            path: 'profileImage',
            model: 'Content',
            select: 'contents',
          },
        ],
      },
      {
        $or: [
          {
            name: { $regex: value, $options: 'i' },
          },
          {
            vypperID: { $regex: value, $options: 'i' },
          },
        ],
      },
    );
    return {
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
      })),
    };
  }
}

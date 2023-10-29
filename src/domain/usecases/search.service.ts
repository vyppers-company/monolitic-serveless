import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IProfile } from '../entity/user.entity';
import {
  IQueriesSearchUser,
  ISearchUseCase,
} from '../interfaces/usecases/search.interface';
import { PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchUsersService implements ISearchUseCase {
  constructor(private readonly userRepository: UserRepository) {}
  async searchUser(
    queries: IQueriesSearchUser,
    myId: string,
  ): Promise<PaginateResult<IProfile>> {
    const getCategories = ({
      value,
      limit,
      page,
      verified,
      ...rest
    }: IQueriesSearchUser) => {
      const categories = { ...rest };
      const obj = {};
      if (categories.biotype) {
        obj['caracteristics.biotype'] = {
          $in:
            typeof categories.biotype === 'string'
              ? [categories.biotype]
              : categories.biotype,
        };
      }
      if (categories.ethnicity) {
        obj[`caracteristics.ethnicity`] = {
          $in:
            typeof categories.ethnicity === 'string'
              ? [categories.ethnicity]
              : categories.ethnicity,
        };
      }
      if (categories.eyes) {
        obj['caracteristics.eyes'] = {
          $in:
            typeof categories.eyes === 'string'
              ? [categories.eyes]
              : categories.eyes,
        };
      }
      if (categories.gender) {
        obj['caracteristics.gender'] = {
          $in:
            typeof categories.gender === 'string'
              ? [categories.gender]
              : categories.gender,
        };
      }
      if (categories.hair) {
        obj['caracteristics.hair'] = {
          $in:
            typeof categories.hair === 'string'
              ? [categories.hair]
              : categories.hair,
        };
      }

      return obj;
    };

    const filters = [];
    const finalCategories = getCategories(queries);

    if (Object.keys(finalCategories).length) {
      filters.push(finalCategories);
    }

    if (queries.value) {
      filters.push({
        $or: [
          {
            name: { $regex: queries.value, $options: 'i' },
          },
          {
            vypperID: { $regex: queries.value, $options: 'i' },
          },
        ],
      });
    }

    if (queries.verified) {
      filters.push({
        verified: { $eq: queries.verified === 'true' ? true : false },
      });
    }
    const user = await this.userRepository.findOne({ _id: myId });

    user.bans && user.bans.length
      ? filters.push({
          _id: { $not: { $in: user.bans } },
        })
      : null;

    filters.push({
      bans: { $not: { $in: [myId] } },
    });

    const finalFilters = {};
    if (filters.length) {
      finalFilters['$and'] = filters;
    }

    const result = await this.userRepository.findPaginated(
      {
        limit: Number(queries.limit) || 10,
        page: Number(queries.page) || 1,
        populate: [
          {
            path: 'profileImage',
            model: 'Content',
            select: 'contents',
          },
        ],
      },
      Object.keys(finalFilters).length ? finalFilters : null,
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
        _id: doc._id,
        vypperID: doc.vypperID,
        name: doc.name,
        profileImage: doc.profileImage,
      })),
    };
  }
}

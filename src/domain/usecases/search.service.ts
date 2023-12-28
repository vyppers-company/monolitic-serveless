import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IProfile } from '../entity/user.entity';
import {
  IQueriesSearchUser,
  ISearchUseCase,
} from '../interfaces/usecases/search.interface';
import { PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { groupBy } from 'src/shared/utils/groupBy';
import { ITypeContent } from '../entity/contents';

@Injectable()
export class SearchUsersService implements ISearchUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contentRepository: ContentRepository,
  ) {}
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
            vypperId: { $regex: queries.value, $options: 'i' },
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
        vypperId: doc.vypperId,
        name: doc.name,
        profileImage: doc.profileImage,
      })),
    };
  }

  async searchUserV2(
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
            vypperId: { $regex: queries.value, $options: 'i' },
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

    const promises = result.docs.map(async (user) => {
      return await this.contentRepository.aggregate([
        {
          $match: {
            owner: String(user._id),
            contents: { $exists: true, $ne: [] },
            type: { $nin: [ITypeContent.DOCUMENT, ITypeContent.PROFILE] },
          },
        },
        {
          $sort: { likersId: -1 },
        },
        {
          $addFields: {
            hasPlans: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $ifNull: ['$plans', []] }, []] },
                    { $ne: ['$plans', null] },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $sort: { hasPlan: -1 },
        },
        {
          $project: {
            _id: 1,
            owner: 1,
            contents: 1,
            type: 1,
            likersId: 1,
            plans: 1,
            hasPlans: 1,
          },
        },
        {
          $limit: 5,
        },
      ]);
    });

    const resultContent = await Promise.all(promises);
    const groupedByUser = groupBy(resultContent, 'owner');
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
        vypperId: doc.vypperId,
        name: doc.name,
        profileImage: doc.profileImage,
        contents: groupedByUser[doc._id],
      })),
    };
  }
  async searchUserV2Opened(
    queries: Pick<IQueriesSearchUser, 'limit' | 'page'>,
  ): Promise<PaginateResult<IProfile>> {
    const result = await this.userRepository.findPaginated(
      {
        sort: { followers: -1 },
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
      null,
    );

    const promises = result.docs.map(async (user) => {
      return await this.contentRepository.aggregate([
        {
          $match: {
            owner: String(user._id),
            contents: { $exists: true, $ne: [] },
            type: { $nin: [ITypeContent.DOCUMENT, ITypeContent.PROFILE] },
          },
        },
        {
          $sort: { likersId: -1 },
        },
        {
          $addFields: {
            hasPlans: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $ifNull: ['$plans', []] }, []] },
                    { $ne: ['$plans', null] },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $sort: { hasPlan: -1 },
        },
        {
          $project: {
            _id: 1,
            owner: 1,
            contents: 1,
            type: 1,
            likersId: 1,
            plans: 1,
            hasPlans: 1,
          },
        },
        {
          $limit: 5,
        },
      ]);
    });

    const resultContent = await Promise.all(promises);
    const groupedByUser = groupBy(resultContent, 'owner');
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
        vypperId: doc.vypperId,
        followers: doc.followers,
        name: doc.name,
        profileImage: doc.profileImage,
        contents: groupedByUser[doc._id],
      })),
    };
  }
}

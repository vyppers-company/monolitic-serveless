import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IProfile } from '../entity/user.entity';
import {
  IQueriesSearchUser,
  ISearchUseCase,
} from '../interfaces/usecases/search.interface';
import { PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IContentEntity } from '../entity/contents';

@Injectable()
export class SearchUsersService implements ISearchUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contentRepository: ContentRepository,
  ) {}
  async searchUserByCriteria(
    myId: string,
    limit: number,
    page: number,
    type: string,
    isFollowed: string,
    sort: string,
    isVerified: string,
  ): Promise<PaginateResult<IProfile>> {
    const finalFilter = {
      options: {
        limit: Number(limit) || 10,
        page: Number(page) || 1,
        populate: [
          {
            path: 'profileImage',
            select: 'contents',
            model: 'Content',
          },
        ],
      },
      filter: {},
    };

    if (type === 'NEWS') {
      finalFilter.options['sort'] = {
        createdAt: -1,
      };
      const dateFilter = new Date();
      const finalDateFilter = dateFilter.setUTCDate(
        dateFilter.getUTCDate() - 7,
      );
      finalFilter.filter['createdAt'] = {
        $gte: new Date(finalDateFilter),
      };
    }

    if (type === 'MOST_FOLLOWED') {
      finalFilter.options['sort'] = {
        followers: -1,
      };
    }

    if (isFollowed === 'true') {
      finalFilter.filter['followers'] = { $in: [myId] };
    }
    if (isFollowed === 'false') {
      finalFilter.filter['followers'] = { $not: { $in: [myId] } };
    }

    if (sort === 'from_recent') {
      finalFilter.options['sort'] = {
        createdAt: -1,
      };
    }

    if (sort === 'from_older') {
      finalFilter.options['sort'] = {
        createdAt: 1,
      };
    }

    if (isVerified === 'true') {
      finalFilter.filter['verified'] = true;
    }
    if (isVerified === 'false') {
      finalFilter.filter['verified'] = false;
    }

    const result = await this.userRepository.findPaginated(
      finalFilter.options,
      finalFilter.filter,
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
        isOnline: doc.isOnline,
        sinceAt: doc.createdAt,
        isVerified: doc.verified,
        isFollowed:
          doc.followers && doc.followers ? doc.followers.includes(myId) : false,
      })),
    };
  }

  async searchUser(
    queries: IQueriesSearchUser,
    myId: string,
  ): Promise<PaginateResult<IProfile>> {
    const getCategories = ({
      value,
      limit,
      page,
      verified,
      limitByUser,
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

    filters.push({
      isBanned: false,
    });

    const finalFilters = {};
    if (filters.length) {
      finalFilters['$and'] = filters;
    }

    const result = await this.userRepository.findPaginated(
      {
        limit: Number(queries.limit) || 10,
        page: Number(queries.page) || 1,
        sort: {
          createdAt: -1,
          followers: 1,
        },
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
    { limitByUser = 3, ...queries }: IQueriesSearchUser,
    myId: string,
  ): Promise<PaginateResult<IContentEntity>> {
    const getCategories = ({
      value,
      limit,
      page,
      verified,
      limitByUser,
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

    filters.push({
      _id: { $not: { $eq: myId } },
    });

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

    filters.push({
      isDeleted: false,
    });

    const result = await this.contentRepository.findPaginated(
      {
        limit: Number(queries.limit) || 10,
        page: Number(queries.page) || 1,
        sort: {
          likersId: -1,
          createdAt: -1,
        },
        populate: [
          {
            path: 'owner',
            model: 'User',
            select: 'name profileImage vypperId likersId verified plans',
            match: finalFilters,
            populate: [
              {
                path: 'profileImage',
                model: 'Content',
                select: 'contents',
              },
            ],
          },
        ],
        lean: true,
      },
      null,
    );

    const finalDocs = result.docs
      .map((item) => ({
        ...item,
        likersId: item.likersId,
        plans: item.plans.map(({ paymentPlanId, subscribers, ...rest }) => ({
          ...rest,
          subscribers: subscribers.length,
        })),
      }))
      .filter((item) => item.owner);

    const finalDocsFiltered: IContentEntity[] = finalDocs.reduce(
      (acc: IContentEntity[], curr: IContentEntity) => {
        if (!acc.length) {
          acc.push({ ...curr });
          return acc;
        }
        const countByUser = acc.filter(
          //@ts-ignore
          (doc) => String(doc.owner._id) === String(curr.owner._id),
        ).length;

        if (countByUser < limitByUser) {
          acc.push({ ...curr });
        }
        return acc;
      },
      [],
    );

    return {
      totalDocs: finalDocsFiltered.length,
      limit: result.limit,
      totalPages: finalDocsFiltered.length > result.limit ? result.page : 1,
      page: result.page,
      offset: result.offset,
      pagingCounter: result.pagingCounter,
      hasPrevPage:
        finalDocsFiltered.length > result.limit ? result.hasPrevPage : false,
      hasNextPage:
        finalDocsFiltered.length > result.limit ? result.hasNextPage : false,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      docs: finalDocsFiltered,
    };
  }
}

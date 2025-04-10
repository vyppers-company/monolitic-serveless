import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IProfile } from '../entity/user.entity';
import {
  IQueriesSearchUser,
  ISearchUseCase,
} from '../interfaces/usecases/search.interface';
import { PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IContentEntity, ITypeContent } from '../entity/contents';
import { decideContent } from 'src/shared/utils/decideContent';
import { MyPurchasesRepository } from 'src/data/mongoose/repositories/my-purchases.repository';
import { isSubscriptor } from 'src/shared/utils/isSubscriptor';

@Injectable()
export class SearchUsersService implements ISearchUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contentRepository: ContentRepository,
    private readonly myPurchase: MyPurchasesRepository,
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
    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      populate: [
        {
          path: 'profileImage',
          select: 'contents',
          model: 'Content',
        },
      ],
    };
    const filters = [];

    if (type === 'NEWS') {
      options['sort'] = {
        createdAt: -1,
      };
      const dateFilter = new Date();
      const finalDateFilter = dateFilter.setUTCDate(
        dateFilter.getUTCDate() - 7,
      );
      filters.push({
        createdAt: {
          $gte: new Date(finalDateFilter),
        },
      });
    }

    if (type === 'MOST_FOLLOWED') {
      options['sort'] = {
        followers: -1,
      };
    }

    if (isFollowed === 'true') {
      filters.push({
        followers: {
          $in: [myId],
        },
      });
    }
    if (isFollowed === 'false') {
      filters.push({
        followers: {
          $not: {
            $in: [myId],
          },
        },
      });
    }

    if (sort === 'from_recent') {
      options['sort'] = {
        createdAt: -1,
      };
    }

    if (sort === 'from_older') {
      options['sort'] = {
        createdAt: 1,
      };
    }

    if (isVerified === 'true') {
      filters.push({
        verified: true,
      });
    }
    if (isVerified === 'false') {
      filters.push({
        verified: false,
      });
    }

    filters.push({ _id: { $not: { $in: [myId] } } });

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
      options,
      finalFilters,
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
          {
            path: 'plans',
            model: 'Plan',
            select: 'name price subscribers',
          },
        ],
        lean: true,
      },
      {
        $or: [
          {
            type: ITypeContent.FEED,
          },
          {
            type: ITypeContent.STORY,
          },
          {
            type: ITypeContent.SHORTS,
          },
        ],
      },
    );

    const myPurchases = await this.myPurchase.findOne({ owner: myId }, null, {
      lean: true,
    });

    const myPurchasesContents = myPurchases ? myPurchases.contents : [];

    const finalDocs = result.docs
      .filter((item) => item.owner && item.contents.length)
      .map((doc) => {
        const content = decideContent(doc, myId, myPurchasesContents);
        const buyedAsSingleContent = myPurchasesContents.some(
          (content) => String(doc._id) === String(content),
        );
        return {
          _id: doc._id,
          type: doc.type,
          owner: {
            _id: doc.owner._id,
            name: doc.owner.name,
            vypperId: doc.owner.vypperId,
            isOnline: doc.owner.isOnline,
            isVerfied: doc.owner.verified,
            profileImage: doc.owner.profileImage,
          },
          isFollowed:
            doc.owner.followers && doc.owner.followers.length
              ? doc.owner.followers.includes(myId)
              : false,
          canEdit: String(doc.owner._id) === String(myId) ? true : false,
          contents: content,
          likersId: doc.likersId,
          product: doc.productId,
          plans:
            doc.plans && doc.plans.length
              ? doc.plans.map((plan) =>
                  !plan.isDeleted || !plan.activate
                    ? {
                        _id: plan._id,
                        name: plan.name,
                        price: plan.price,
                        benefits: plan.benefits,
                      }
                    : {
                        _id: plan._id,
                        name: 'Plano encerrado, não disponível para novos assinantes',
                        price: plan.price,
                        benefits: plan.benefits,
                      },
                )
              : [],
          isSubscriptor: isSubscriptor(doc.plans, myId),
          isBuyerSingleContent: buyedAsSingleContent,
          text: doc.text,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };
      });

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

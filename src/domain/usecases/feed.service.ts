import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IFeedUseCase } from '../interfaces/usecases/feed.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { PaginateResult } from 'mongoose';
import { ITypeContent } from '../entity/contents';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { decideContent } from 'src/shared/utils/decideContent';
import { isSubscriptor } from 'src/shared/utils/isSubscriptor';
import { MyPurchasesRepository } from 'src/data/mongoose/repositories/my-purchases.repository';

@Injectable()
export class FeedService implements IFeedUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly userRepository: UserRepository,
    private readonly myPurchase: MyPurchasesRepository,
  ) {}
  async feed(
    type: ITypeContent,
    myId: string,
    limit: number,
    page: number,
  ): Promise<PaginateResult<any>> {
    const user = await this.userRepository.findOne({
      _id: myId,
      isBanned: false,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const filterUsers = [];

    if (
      user.interests &&
      user.interests.gender &&
      user.interests.gender.length
    ) {
      filterUsers.push({
        ['caracteristics.gender']: { $in: user.interests.gender },
      });
    }

    user.bans && user.bans.length
      ? filterUsers.push({
          _id: { $not: { $in: user.bans } },
        })
      : null;

    filterUsers.push({
      bans: { $not: { $in: [myId] } },
    });

    const users = await this.userRepository.find(
      filterUsers.length ? { $and: filterUsers } : {},
      null,
      {
        lean: true,
      },
    );

    const onwerIds = users.map((us) => String(us._id));
    onwerIds.push(myId);

    const filterContents = [];

    if (type) {
      filterContents.push({ type: { $eq: type } });
    }

    if (onwerIds) {
      filterContents.push({
        owner: { $in: onwerIds },
      });
    }

    filterContents.push({
      isDeleted: false,
    });

    const result = await this.contentRepository.findPaginated(
      {
        sort: { _id: -1 },
        limit: Number(limit),
        page: Number(page),
        lean: true,
        populate: [
          {
            path: 'productId',
            model: 'Product',
            select: 'currency price limit benefits activated verified',
          },
          {
            path: 'plans',
            model: 'Plan',
            select: 'subscribers name price benefits',
          },
          {
            path: 'owner',
            model: 'User',
            select:
              'vypperId name profileImage caracteristics bans followers isOnline verified',
            populate: [
              {
                path: 'profileImage',
                model: 'Content',
                select: 'contents',
              },
            ],
          },
        ],
      },
      { $and: filterContents },
    );

    const myPurchases = await this.myPurchase.findOne({ owner: myId }, null, {
      lean: true,
    });

    const myPurchasesContents = myPurchases ? myPurchases.contents : [];

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
      docs: result.docs.map((doc: any) => {
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
      }),
    };
  }
}

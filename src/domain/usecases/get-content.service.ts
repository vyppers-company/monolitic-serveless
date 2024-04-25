import { Injectable } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { IContentsUseCase } from '../interfaces/usecases/get-content.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import {
  IContentEntity,
  IContentEntityExtended,
  ITypeContent,
} from '../entity/contents';
import { decideContent } from 'src/shared/utils/decideContent';
import { isSubscriptor } from 'src/shared/utils/isSubscriptor';
import { MyPurchasesRepository } from 'src/data/mongoose/repositories/my-purchases.repository';

@Injectable()
export class GetContentService implements IContentsUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly myPurchase: MyPurchasesRepository,
  ) {}
  async getContents(
    profileId: string,
    myId: string,
    type: ITypeContent,
    limit: number,
    page: number,
  ): Promise<PaginateResult<IContentEntity>> {
    const result = await this.contentRepository.findPaginated(
      {
        sort: { _id: -1 },
        limit: Number(limit),
        page: Number(page),
        populate: [
          {
            path: 'productId',
            model: 'Product',
            select: 'currency price limit benefits activated',
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
              'vypperId name profileImage followers planConfiguration isOnline verified',
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
      {
        owner: profileId || myId,
        type,
        isDeleted: false,
      },
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
              ? doc.plans.map((plan) => ({
                  _id: plan._id,
                  name: plan.name,
                  price: plan.price,
                  benefits: plan.benefits,
                }))
              : [],
          text: doc.text,
          isSubscriptor: isSubscriptor(doc.plans, myId),
          isBuyerSingleContent: buyedAsSingleContent,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };
      }),
    };
  }

  async getContent(
    profileId: string,
    myId: string,
    contentId: string,
  ): Promise<IContentEntityExtended> {
    const content: any = await this.contentRepository.findOne(
      {
        owner: profileId || myId,
        _id: contentId,
        isDeleted: false,
      },
      null,
      {
        populate: [
          {
            path: 'productId',
            model: 'Product',
            select: 'currency price limit benefits activated',
          },
          {
            path: 'plans',
            model: 'Plan',
            select: 'subscribers name price benefits',
          },
          {
            path: 'owner',
            model: 'User',
            select: 'vypperId name profileImage followers isOnline verified',
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
    );
    const myPurchases = await this.myPurchase.findOne({ owner: myId }, null, {
      lean: true,
    });

    const myPurchasesContents = myPurchases ? myPurchases.contents : [];
    const buyedAsSingleContent = myPurchasesContents.some(
      (cont) => String(content._id) === String(cont),
    );
    return {
      contents: decideContent(content, myId, myPurchasesContents),
      likersId: content.likersId,
      product: content.productId,
      owner: {
        _id: content.owner._id,
        name: content.owner.name,
        vypperId: content.owner.vypperId,
        isOnline: content.owner.isOnline,
        isVerfied: content.owner.verified,
        profileImage: content.owner.profileImage,
      },
      isFollowed:
        content.owner.followers && content.owner.followers.length
          ? content.owner.followers.includes(myId)
          : false,
      text: content.text,
      type: content.type,
      isSubscriptor: isSubscriptor(content.plans, myId),
      isBuyerSingleContent: buyedAsSingleContent,
      plans:
        content.plans && content.plans.length
          ? content.plans.map((plan) => ({
              _id: plan._id,
              name: plan.name,
              price: plan.price,
              benefits: plan.benefits,
            }))
          : [],
      canEdit: String(content.owner._id) === String(myId) ? true : false,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    };
  }
  async getProfileImage(owner: string): Promise<IContentEntity> {
    const content = await this.contentRepository.findOne({
      owner,
      type: ITypeContent.PROFILE,
    });
    return content
      ? {
          _id: String(content._id),
          owner: content.owner,
          contents: content.contents,
        }
      : null;
  }
}

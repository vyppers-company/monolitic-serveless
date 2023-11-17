import { Injectable } from '@nestjs/common';
import { IFeedUseCase } from '../interfaces/usecases/feed.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { PaginateResult } from 'mongoose';
import { ITypeContent } from '../entity/contents';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { decideContent } from 'src/shared/utils/decideContent';

@Injectable()
export class FeedService implements IFeedUseCase {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async feed(
    type: ITypeContent,
    myId: string,
    limit: number,
    page: number,
  ): Promise<PaginateResult<any>> {
    const user = await this.userRepository.findOne({ _id: myId });

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

    const result = await this.contentRepository.findPaginated(
      {
        sort: { _id: -1 },
        limit: Number(limit),
        page: Number(page),
        populate: [
          {
            path: 'planId',
            model: 'Plan',
            select: 'subscribers',
          },
          {
            path: 'owner',
            model: 'User',
            select: 'vypperId name profileImage caracteristics bans followers',
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
        const content = decideContent(doc, myId);
        return {
          _id: doc._id,
          type: doc.type,
          owner: {
            _id: doc.owner._id,
            name: doc.owner.name,
            vypperId: doc.owner.vypperId,
            profileImage: doc.owner.profileImage,
          },
          isFollowed:
            doc.owner.followers && doc.owner.followers.length
              ? doc.owner.followers.includes(myId)
              : false,
          canEdit: String(doc.owner._id) === String(myId) ? true : false,
          contents: content,
          likersId: doc.likersId,
          text: doc.text,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };
      }),
    };
  }
}

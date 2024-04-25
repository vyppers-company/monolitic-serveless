import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import {
  IGetProfileUseCase,
  IProfileExt,
} from '../interfaces/usecases/user-service.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IContentEntity, ITypeContent } from '../entity/contents';
import { CryptoAdapter } from 'src/infra/adapters/crypto/cryptoAdapter';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { ITYPEUSER } from '../entity/user.entity';
import { ConfigNotificationRepository } from 'src/data/mongoose/repositories/config-notification.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class GetProfileService implements IGetProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contentRepository: ContentRepository,
    private readonly crypto: CryptoAdapter,
    private readonly notificationConfig: ConfigNotificationRepository,
  ) {}
  async publicProfile(vId: string) {
    const user = await this.userRepository.findOne(
      { vypperId: vId, isPublic: true },
      null,
      {
        lean: true,
        populate: [
          { path: 'profileImage', select: 'contents', model: 'Content' },
          {
            path: 'planConfiguration',
            select: 'name description subscribers activated benefits price',
            model: 'Plan',
          },
        ],
      },
    );
    if (!user) {
      throw new HttpException(
        'Sorry, Maybe this user is not public or not exist :(',
        HttpStatus.NOT_FOUND,
      );
    }
    const contents = await this.contentRepository.find(
      { owner: user._id },
      null,
      {
        populate: [
          {
            path: 'productId',
            model: 'Product',
            select: ' price benefits activated owner',
          },
        ],
      },
    );
    const content = user.profileImage as IContentEntity;

    const finalObjt = {
      _id: user._id,
      canEdit: false,
      name: user.name,
      vypperId: user.vypperId || null,
      bio: user.bio || null,
      profileImage: content ? content.contents[0].content : null,
      followersQtd: user.followers ? user.followers.length : 0,
      isFollowed: false,
      publicContents: contents
        .filter(
          (content) =>
            !content.plans.length &&
            !content.productId &&
            content.type !== ITypeContent.PROFILE,
        )
        .map((content) => ({
          type: content.type,
          _id: content._id,
          owner: content.owner,
          likersQtd: content.likersId.length,
          text: content.text,
          contents: content.contents.map((image) => ({
            ...image,
            blockedThumb: null,
            _id: randomUUID(),
          })),
        })),
      privateContents: contents
        .filter((content) => content.plans.length || content.productId)
        .map((content) => ({
          type: content.type,
          _id: content._id,
          owner: content.owner,
          likersQtd: content.likersId.length,
          text: content.text,
          plans: content.plans.map((plan: any) => ({
            _id: plan._id,
            activate: plan.activate,
            benefits: plan.benefits,
            name: plan.name,
            price: plan.price,
            subscribers: plan.subscribers.length,
          })),
          productId: content.productId,
          contents: content.contents.map((image) => ({
            ...image,
            content: null,
            thumb: null,
            _id: randomUUID(),
          })),
        })),
      qtdLikes: contents.length
        ? contents.reduce((acc, curr) => {
            acc.push(...curr.likersId);
            return acc;
          }, []).length
        : 0,
      payedContents: contents.length
        ? contents.filter(
            (content) =>
              content.type !== ITypeContent.PROFILE && content.plans.length,
          ).length
        : 0,
      freeContents: contents.length
        ? contents.filter(
            (content) =>
              content.type !== ITypeContent.PROFILE && !content.plans.length,
          ).length
        : 0,
    };
    finalObjt['planConfiguration'] = user.planConfiguration.length
      ? user.planConfiguration.map((plan: any) => ({
          _id: plan._id,
          activate: plan.activate,
          benefits: plan.benefits,
          name: plan.name,
          price: plan.price,
        }))
      : [];
    return finalObjt;
  }

  async getPersonalData(
    userId: string,
    myId: string,
  ): Promise<
    Pick<
      IProfileExt,
      | 'bio'
      | '_id'
      | 'vypperId'
      | 'name'
      | 'profileImage'
      | 'birthday'
      | 'email'
      | 'phone'
      | 'interests'
      | 'paymentConfiguration'
      | 'planConfiguration'
      | 'caracteristics'
      | 'bansQtd'
      | 'followersQtd'
      | 'freeContents'
      | 'payedContents'
      | 'qtdLikes'
    >
  > {
    const user = await this.userRepository.findOne(
      { _id: userId, isBanned: false, isFreezed: false },
      null,
      {
        lean: true,
        populate: [
          { path: 'profileImage', select: 'contents', model: 'Content' },
          {
            path: 'planConfiguration',
            select: 'name description price subscribers',
            model: 'Plan',
            populate: [
              {
                path: 'subscribers.vypperSubscriptionId',
                select: '_id name vypperId profileImage',
                model: 'User',
                populate: [
                  {
                    path: 'profileImage',
                    select: 'contents',
                    model: 'Content',
                  },
                ],
              },
            ],
          },
          {
            path: 'paymentConfiguration',
            model: 'Payment',
            select: 'paymentMethods',
          },
        ],
      },
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const contents = await this.contentRepository.find({ owner: user._id });
    const content = user.profileImage as IContentEntity;
    const paymentConfiguration = user.paymentConfiguration as any;

    const finalObjt = {
      _id: user._id,
      birthday: user.type === ITYPEUSER.CREATOR ? user.birthday : null,
      canEdit: myId === userId ? true : false,
      name: user.name,
      vypperId: user.vypperId || null,
      bio: user.bio || null,
      profileImage: content ? content.contents[0].content : null,
      followersQtd: user.followers ? user.followers.length : 0,
      isOnline: user.isOnline,
      isVerified: user.verified,
      isFollowed:
        user.followers && user.followers
          ? user.followers.includes(myId)
          : false,
      qtdLikes: contents.length
        ? contents.reduce((acc, curr) => {
            acc.push(...curr.likersId);
            return acc;
          }, []).length
        : 0,
      payedContents: contents.length
        ? contents.filter(
            (content) =>
              content.type !== ITypeContent.PROFILE && content.plans.length,
          ).length
        : 0,
      freeContents: contents.length
        ? contents.filter(
            (content) =>
              content.type !== ITypeContent.PROFILE && !content.plans.length,
          ).length
        : 0,
    };

    if (myId === userId) {
      const configNotificationResp = await this.notificationConfig.findOne(
        {
          owner: user._id,
        },
        { enabled: 1, dontShowAnymore: 1 },
        { lean: true },
      );
      finalObjt['planConfiguration'] = user.planConfiguration;
      finalObjt['paymentConfiguration'] = paymentConfiguration
        ? {
            _id: paymentConfiguration._id,
            paymentMethods: paymentConfiguration.paymentMethods.map((item) => ({
              ...item,
            })),
          }
        : null;
      finalObjt['caracteristics'] = user.caracteristics;
      finalObjt['email'] = user.email
        ? this.crypto.decryptText(user.email, ICryptoType.USER)
        : null;
      finalObjt['phone'] = user.phone
        ? this.crypto.decryptText(user.phone, ICryptoType.USER)
        : null;
      finalObjt['interests'] = user.interests;
      finalObjt['bansQtd'] = user.bans ? user.bans.length : 0;
      finalObjt['configNotification'] = configNotificationResp || null;
    } else {
      finalObjt['planConfiguration'] = user.planConfiguration.length
        ? user.planConfiguration.map((plan: any) => ({
            _id: plan._id,
            activate: plan.activate,
            benefits: plan.benefits,
            name: plan.name,
            price: plan.price,
          }))
        : [];
    }

    return finalObjt;
  }
}

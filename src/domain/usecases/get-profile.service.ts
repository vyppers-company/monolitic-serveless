import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import {
  IGetProfileUseCase,
  IProfileExt,
} from '../interfaces/usecases/user-service.interface';
import { Injectable } from '@nestjs/common';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IContentEntity, ITypeContent } from '../entity/contents';
import { CryptoAdapter } from 'src/infra/adapters/crypto/cryptoAdapter';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';

@Injectable()
export class GetProfileService implements IGetProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contentRepository: ContentRepository,
    private readonly crypto: CryptoAdapter,
  ) {}
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
    const user = await this.userRepository.findOne({ _id: userId }, null, {
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
    });
    const contents = await this.contentRepository.find({ owner: user._id });
    const content = user.profileImage as IContentEntity;

    const paymentConfiguration = user.paymentConfiguration as any;

    const finalObjt = {
      _id: user._id,
      name: user.name,
      vypperId: user.vypperId || null,
      bio: user.bio || null,
      profileImage: content ? content.contents[0] : null,
      planConfiguration: user.planConfiguration.length
        ? user.planConfiguration.map((pln: any) => ({
            ...pln,
            subscribers:
              myId === userId ? pln.subscribers : pln.subscribers.length,
          }))
        : [],
      followersQtd: user.followers ? user.followers.length : 0,
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
      finalObjt['caracteristics'] = user.caracteristics;
      finalObjt['birthday'] = user.birthday;
      finalObjt['email'] = user.email
        ? this.crypto.decryptText(user.email, ICryptoType.USER)
        : null;
      finalObjt['phone'] = user.phone
        ? this.crypto.decryptText(user.phone, ICryptoType.USER)
        : null;
      finalObjt['interests'] = user.interests;
      finalObjt['bansQtd'] = user.bans ? user.bans.length : 0;
      finalObjt['paymentConfiguration'] = paymentConfiguration
        ? {
            _id: paymentConfiguration._id,
            paymentMethods: paymentConfiguration.paymentMethods.map((item) => ({
              ...item,
            })),
          }
        : null;
    }

    return finalObjt;
  }
}

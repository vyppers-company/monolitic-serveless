import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import {
  IGetProfileUseCase,
  IProfileExt,
} from '../interfaces/usecases/user-service.interface';
import { Injectable } from '@nestjs/common';
import { ILogged } from '../interfaces/others/logged.interface';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IContentEntity } from '../entity/contents';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';

@Injectable()
export class GetProfileService implements IGetProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contentRepository: ContentRepository,
  ) {}
  async getPersonalData(
    logged: ILogged,
  ): Promise<
    Pick<
      IProfileExt,
      | 'bio'
      | '_id'
      | 'vypperID'
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
    const user = await this.userRepository.findOne({ _id: logged._id }, null, {
      populate: [
        { path: 'profileImage', select: 'contents', model: 'Content' },
      ],
    });
    const contents = await this.contentRepository.find({ owner: user._id });
    const content = user.profileImage as IContentEntity;

    return {
      _id: user._id,
      name: user.name,
      vypperID: user.vypperID || null,
      bio: user.bio || null,
      profileImage: content.contents[0],
      caracteristics: user.caracteristics || null,
      birthday: user.birthday || null,
      email: user.email || null,
      phone: user.phone || null,
      interests: user.interests || null,
      paymentConfiguration: user.paymentConfiguration || null,
      planConfiguration: user.planConfiguration || null,
      bansQtd: user.bans ? user.bans.length : 0,
      followersQtd: user.followers ? user.followers.length : 0,
      qtdLikes: contents.length
        ? contents.reduce((acc, curr) => {
            acc.push(...curr.likersId);
            return acc;
          }, []).length
        : 0,
      payedContents: contents.filter((content) => content.payed).length,
      freeContents: contents.filter((content) => !content.payed).length,
    };
  }
}

import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import {
  IGetProfileUseCase,
  IProfileExt,
} from '../interfaces/usecases/user-service.interface';
import { Injectable } from '@nestjs/common';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import { ILogged } from '../interfaces/others/logged.interface';
import { IProfile } from '../entity/user.entity';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { IContentEntity } from '../entity/contents';

@Injectable()
export class GetProfileService implements IGetProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}
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
    >
  > {
    const user = await this.userRepository.findOne({ _id: logged._id }, null, {
      populate: [
        { path: 'profileImage', select: 'contents', model: 'Content' },
      ],
    });
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
      bansQtd: user.bans.length,
    };
  }
}

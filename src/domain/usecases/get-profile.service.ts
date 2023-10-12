import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IGetProfileUseCase } from '../interfaces/usecases/user-service.interface';
import { Injectable } from '@nestjs/common';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import { ILogged } from '../interfaces/others/logged.interface';
import { IProfile } from '../entity/user.entity';
import { ContentRepository } from 'src/data/mongoose/repositories/content.repository';
import { ITypeContent } from '../entity/contents';

@Injectable()
export class GetProfileService implements IGetProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly contentRepository: ContentRepository,
  ) {}
  async getPersonalData(
    logged: ILogged,
  ): Promise<
    Pick<IProfile, 'bio' | '_id' | 'profileId' | 'name' | 'profileImage'>
  > {
    const user = await this.userRepository.findOne(
      { _id: logged._id },
      { name: 1, profileId: 1, bio: 1 },
    );
    const content = await this.contentRepository.findOne({
      owner: user._id,
      type: ITypeContent.PROFILE,
    });

    return {
      _id: user._id,
      name: user.name,
      profileId: user.profileId || null,
      bio: user.bio || null,
      profileImage: content.contents[0] || null,
    };
  }
}

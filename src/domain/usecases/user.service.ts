import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IUserEntity } from '../entity/user.entity';
import { ILogged } from '../interfaces/others/logged.interface';
import { IUserService } from '../interfaces/usecases/user-service.interface';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}
  async getPersonalData(
    logged: ILogged,
  ): Promise<Pick<IUserEntity, 'email' | 'phone' | 'profileId'>> {
    const user = await this.userRepository.findOne({ _id: logged._id });
    return {
      email: this.cryptoAdapter.decryptText(user.email, ICryptoType.USER),
      phone: this.cryptoAdapter.decryptText(user.phone, ICryptoType.USER),
      profileId: user.profileId,
    };
  }
}

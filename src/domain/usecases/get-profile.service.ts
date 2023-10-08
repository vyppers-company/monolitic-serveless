import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IGetProfileUseCase } from '../interfaces/usecases/user-service.interface';
import { Injectable } from '@nestjs/common';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import { ILogged } from '../interfaces/others/logged.interface';
import { IProfile } from '../entity/user.entity';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';

@Injectable()
export class GetProfileService implements IGetProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}
  async getPersonalData(logged: ILogged): Promise<IProfile> {
    const user = await this.userRepository.findOne({ _id: logged._id });
    return {
      ...user,
      email: this.cryptoAdapter.decryptText(user.email, ICryptoType.USER),
      phone: this.cryptoAdapter.decryptText(user.phone, ICryptoType.USER),
    };
  }
}

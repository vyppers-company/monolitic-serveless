import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CryptoAdapter } from '../../infra/adapters/crypto/cryptoAdapter';
import { IRegisterInternalUser } from '../interfaces/usecases/register.interface';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';

import { IInternalUser } from '../entity/internal-users';
import { InternalUserRepository } from 'src/data/mongoose/repositories/internal-user.repository';
import { ILoggedInternalUser } from '../interfaces/others/logged.interface';
import { IInternalRole } from '../entity/internal-role';

@Injectable()
export class RegisterInternalUserService implements IRegisterInternalUser {
  constructor(
    private readonly internalUserRepository: InternalUserRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async registerInternalUser(
    dto: IInternalUser,
    internalUserLogged: ILoggedInternalUser,
  ): Promise<void> {
    if (internalUserLogged.role !== IInternalRole.MANAGEMENT) {
      throw new HttpException(
        'you cant create new internal user',
        HttpStatus.FORBIDDEN,
      );
    }
    const user = await this.internalUserRepository.findOne({
      email: dto.email,
    });

    if (user) {
      throw new HttpException(
        'this user is already registered',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = this.cryptoAdapter.encryptText(
      dto.password,
      ICryptoType.INTERNAL_USER,
    );

    await this.internalUserRepository.create({
      ...dto,
      password: hashedPassword,
    });
  }
}

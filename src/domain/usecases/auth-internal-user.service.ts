import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { CryptoAdapter } from '../../infra/adapters/crypto/cryptoAdapter';
import { generateToken } from '../../shared/helpers/jwe-generator.helper';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { InternalUserRepository } from 'src/data/mongoose/repositories/internal-user.repository';
import { IAuthInternalUser } from '../interfaces/others/auth-internal.interface';
import { IAuthInternalUserUseCase } from '../interfaces/usecases/auth-internal-user.interface';

@Injectable()
export class AuthInternalUserService implements IAuthInternalUserUseCase {
  constructor(
    private readonly userRepository: InternalUserRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async authInternal(dto: IAuthInternalUser) {
    const findedOne = await this.userRepository.findOne(
      { email: dto.email },
      null,
      {
        lean: true,
      },
    );

    if (!findedOne) {
      throw new HttpException(
        { message: 'User not found', reason: 'UserNotFound' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const correctPassword =
      findedOne.password ===
      this.cryptoAdapter.encryptText(dto.password, ICryptoType.INTERNAL_USER);

    if (!correctPassword) {
      throw new HttpException(
        { message: 'Invalid Credentials', reason: 'InvalidCredentials' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await generateToken(
      {
        _id: String(findedOne._id),
        email: String(findedOne.email),
        cpf: String(findedOne.cpf),
        role: findedOne.role,
      },
      ICryptoType.INTERNAL_USER,
    );
    return {
      token,
      info: {
        _id: findedOne._id,
        email: findedOne.email,
        cpf: findedOne.cpf,
        role: findedOne.role,
      },
    };
  }
}

import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import { Auth } from 'src/presentation/dtos/auth.dto';
import regex from 'src/shared/helpers/regex';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IAuthUseCase } from '../interfaces/usecases/auth.interface';
import { generateToken } from '../../shared/helpers/jwe-generator.helper';
@Injectable()
export class AuthService implements IAuthUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async auth(dto: Auth) {
    const isEmail = regex.email.test(dto.emailOrPhone);
    const isPhone = regex.celular.test(dto.emailOrPhone);

    const finalDto = {};

    if (isEmail) {
      const hashedEmail = this.cryptoAdapter.encryptText(dto.emailOrPhone);
      finalDto['email'] = hashedEmail;
    }

    if (isPhone) {
      const hashedPhone = this.cryptoAdapter.encryptText(dto.emailOrPhone);
      finalDto['phone'] = hashedPhone;
    }

    const findedOne = await this.userRepository.findOne(finalDto);

    if (!findedOne) {
      throw new UnauthorizedException('email ou senha inválidos');
    }

    const correctPassword =
      findedOne.password === this.cryptoAdapter.encryptText(dto.password);

    if (!correctPassword) {
      throw new UnauthorizedException('dados inválidos');
    }

    const token = await generateToken({
      _id: String(findedOne._id),
      role: findedOne.role,
    });

    return { token };
  }
}

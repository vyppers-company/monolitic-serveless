import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { CryptoAdapter } from '../../infra/adapters/cryptoAdapter';
import { Auth } from '../../presentation/dtos/auth.dto';
import regex from '../../shared/helpers/regex';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IAuthUseCase } from '../interfaces/usecases/auth.interface';
import { generateToken } from '../../shared/helpers/jwe-generator.helper';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { getAge } from 'src/shared/utils/getAge';
import { IProfile } from '../entity/user.entity';
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
      const hashedEmail = this.cryptoAdapter.encryptText(
        dto.emailOrPhone,
        ICryptoType.USER,
      );
      finalDto['email'] = hashedEmail;
    }

    if (isPhone) {
      const hashedPhone = this.cryptoAdapter.encryptText(
        dto.emailOrPhone,
        ICryptoType.USER,
      );
      finalDto['phone'] = hashedPhone;
    }

    const findedOne = await this.userRepository.findOne(finalDto);

    if (!findedOne) {
      throw new UnauthorizedException();
    }

    const correctPassword =
      findedOne.password ===
      this.cryptoAdapter.encryptText(dto.password, ICryptoType.USER);

    if (!correctPassword) {
      throw new UnauthorizedException();
    }

    const token = await generateToken(
      {
        _id: String(findedOne._id),
        email: String(findedOne.email),
        profileId: String(findedOne.profileId),
      },
      ICryptoType.USER,
    );

    return { token };
  }
  async loginOauth20(user?: IProfile) {
    if (!user) {
      throw new UnauthorizedException();
    }
    const hashedEmail = this.cryptoAdapter.encryptText(
      user.email,
      ICryptoType.USER,
    );
    const findedOne = await this.userRepository.findOne({ email: hashedEmail });

    if (findedOne) {
      const token = await generateToken(
        {
          _id: String(findedOne._id),
          email: String(findedOne.email),
          profileId: String(findedOne.profileId),
        },
        ICryptoType.USER,
      );
      return { token };
    }
    const age = user.birthday ? getAge(user.birthday) : null;

    if (!age) {
      throw new ConflictException('you need to have 16 years old');
    }

    await this.userRepository.create({
      ...user,
      email: hashedEmail,
    });

    const newOne = await this.userRepository.findOne({ email: hashedEmail });

    const token = await generateToken(
      {
        _id: String(newOne._id),
        email: String(newOne.email),
        profileId: null,
      },
      ICryptoType.USER,
    );

    return { token };
  }
}

import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { environment } from 'src/main/config/environment';
import { UnauthorizedException } from '@nestjs/common';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { generateToken } from 'src/shared/helpers/jwe-generator.helper';

interface IProfile {
  email: string;
  name: string;
  profileImage: string;
}

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly cryptoAdapter: CryptoAdapter,
    private readonly userRepository: UserRepository,
  ) {
    super({
      clientID: environment.google.clientID,
      clientSecret: environment.google.clientSecret,
      callbackURL: environment.google.callbackUrl,
      scope: environment.google.scope,
    });
  }
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user: IProfile = {
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      profileImage: photos[0].value,
    };
    done(null, user);
  }
  async login(user?: IProfile) {
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

    const hashedName = this.cryptoAdapter.encryptText(
      user.name,
      ICryptoType.USER,
    );

    await this.userRepository.create({
      name: hashedName,
      email: hashedEmail,
      profileImage: user.profileImage,
    });

    const newOne = await this.userRepository.findOne({ email: hashedEmail });

    const token = await generateToken(
      {
        _id: String(newOne._id),
        email: String(newOne.email),
        profileId: null,
        status: 'GOOGLE_MISSING_SOME_DATA',
      },
      ICryptoType.USER,
    );

    return { token };
  }
}

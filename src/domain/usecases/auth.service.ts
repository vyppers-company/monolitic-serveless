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
import { CreateContentService } from './create-content.service';
import { getImageFromExternalUrl } from 'src/shared/helpers/get-image-from-external-url';
import { S3Service } from './s3-upload.service';
import { ITypeContent } from '../entity/contents';
import { GetContentService } from './get-content.service';
@Injectable()
export class AuthService implements IAuthUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoAdapter: CryptoAdapter,
    private readonly s3: S3Service,
    private readonly contentCreate: CreateContentService,
    private readonly contentGet: GetContentService,
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
    const image = await getImageFromExternalUrl(user.profileImage);

    await this.userRepository.create({
      ...user,
      email: hashedEmail,
    });

    const newOne = await this.userRepository.findOne({ email: hashedEmail });

    const urlS3 = await this.s3.uploadFile(
      { buffer: image, mimetype: 'image/png' },
      'PROFILE',
      String(newOne._id),
    );

    await this.contentCreate.create(
      {
        type: ITypeContent.PROFILE,
        contents: [urlS3],
      },
      String(newOne._id),
    );

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

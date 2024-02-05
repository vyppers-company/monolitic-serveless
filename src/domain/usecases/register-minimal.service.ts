import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IRegisterMinimalUseCase } from '../interfaces/usecases/register.interface';
import { CryptoAdapter } from 'src/infra/adapters/crypto/cryptoAdapter';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { RegisterDtoMinimal } from 'src/presentation/dtos/register.dto';
import { ITYPEUSER } from '../entity/user.entity';
import { CodeRepository } from 'src/data/mongoose/repositories/code.repository';
import { decryptData } from 'src/shared/helpers/jwe-generator.helper';
import { generateName } from 'src/shared/helpers/generator-names';

@Injectable()
export class RegisterMinimalService implements IRegisterMinimalUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoAdapter: CryptoAdapter,
    private readonly codeRecoveryRepository: CodeRepository,
  ) {}
  async registerMinimal(dto: RegisterDtoMinimal) {
    if (dto.email && dto.phone) {
      throw new HttpException(
        'only email or phone is needed nor both',
        HttpStatus.CONFLICT,
      );
    }
    if (!dto.email && !dto.phone) {
      throw new HttpException(
        'At least phone or email is required',
        HttpStatus.CONFLICT,
      );
    }
    if (!dto.termsAndConditions) {
      throw new HttpException(
        'the value needs to be TRUE',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!dto.tokenCode) {
      throw new HttpException('token is needed', HttpStatus.UNAUTHORIZED);
    }

    const decryptedCode = await decryptData(dto.tokenCode, ICryptoType.CODE);

    const code = await this.codeRecoveryRepository.findOne({
      _id: decryptedCode?._id,
    });

    if (!code) {
      throw new HttpException('invalid token code', HttpStatus.UNAUTHORIZED);
    }

    const hashedPhone =
      dto.phone && this.cryptoAdapter.encryptText(dto.phone, ICryptoType.USER);

    const hashedEmail =
      dto.email && this.cryptoAdapter.encryptText(dto.email, ICryptoType.USER);

    const finalDto = {} as { email?: string; phone?: string };

    if (hashedEmail) {
      finalDto['email'] = hashedEmail;
    }

    if (hashedPhone) {
      finalDto['phone'] = hashedPhone;
    }

    if (code.owner !== hashedPhone && code.owner !== hashedEmail) {
      throw new HttpException('inconsistent payload info', HttpStatus.CONFLICT);
    }

    const findedOne = await this.userRepository.findOne(finalDto);

    if (findedOne) {
      if (findedOne.isBanned) {
        throw new HttpException(
          'Account is banned, contact the support team to know more',
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        'email or phone already exist in our database',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = this.cryptoAdapter.encryptText(
      dto.password,
      ICryptoType.USER,
    );

    const newDto = {
      ...finalDto,
      password: hashedPassword,
    };

    const checkAll = await this.userRepository.findAll();
    const uniqueName = generateName(checkAll.map((us) => us.vypperId));

    await this.userRepository.create({
      ...newDto,
      profileImage: null,
      type: ITYPEUSER.USER,
      name: uniqueName,
      vypperId: uniqueName,
      caracteristics: {
        ethnicity: null,
        biotype: null,
        eyes: null,
        gender: null,
        hair: null,
      },
    });

    await this.codeRecoveryRepository.deleteById(code._id);
  }
}

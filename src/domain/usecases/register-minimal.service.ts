import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IRegisterMinimalUseCase } from '../interfaces/usecases/register.interface';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
      throw new ConflictException('only email or phone is needed nor both');
    }
    if (!dto.email && !dto.phone) {
      throw new ConflictException('At least phone or email is required');
    }
    if (!dto.termsAndConditions) {
      throw new UnauthorizedException('the value needs to be TRUE');
    }
    if (!dto.tokenCode) {
      throw new UnauthorizedException('token is needed');
    }

    const decryptedCode = await decryptData(dto.tokenCode, ICryptoType.CODE);

    const code = await this.codeRecoveryRepository.findOne({
      _id: decryptedCode?._id,
    });

    if (!code) {
      throw new UnauthorizedException('invalid token code');
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
      throw new ConflictException('inconsistent payload info');
    }

    const findedOne = await this.userRepository.findOne(finalDto);

    if (findedOne) {
      throw new ConflictException(
        'email or phone already exist in our database',
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
    const uniqueName = generateName(checkAll.map((us) => us.vypperID));

    this.userRepository
      .create({
        ...newDto,
        profileImage: null,
        type: ITYPEUSER.USER,
        name: uniqueName,
        vypperID: uniqueName,
        caracteristics: {
          ethnicity: null,
          biotype: null,
          eyes: null,
          gender: null,
          hair: null,
        },
      })
      .then();
    this.codeRecoveryRepository.deleteById(code._id).then();
  }
}

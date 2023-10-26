import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CryptoAdapter } from '../../infra/adapters/cryptoAdapter';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IRegisterUseCase } from '../interfaces/usecases/register.interface';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { getAge } from 'src/shared/utils/getAge';
import { RegisterDto } from 'src/presentation/dtos/register.dto';
import { ITYPEUSER } from '../entity/user.entity';

@Injectable()
export class RegisterService implements IRegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async register(dto: RegisterDto) {
    if (!dto.termsAndConditions) {
      throw new UnauthorizedException('the value needs to be TRUE');
    }

    const hashedPhone = this.cryptoAdapter.encryptText(
      dto.phone,
      ICryptoType.USER,
    );
    const hashedEmail = this.cryptoAdapter.encryptText(
      dto.email,
      ICryptoType.USER,
    );

    const findedOne = await this.userRepository.findOne({
      $or: [
        {
          phone: hashedPhone,
        },
        {
          email: hashedEmail,
        },
        {
          vypperID: dto.vypperID,
        },
      ],
    });

    if (findedOne) {
      throw new ConflictException(
        'some data is already registered in our database',
      );
    }
    const age = getAge(dto.birthday);

    if (!age) {
      throw new ConflictException('you need to have 16 years old');
    }

    const hashedPassword = this.cryptoAdapter.encryptText(
      dto.password,
      ICryptoType.USER,
    );

    const newDto = {
      ...dto,
      password: hashedPassword,
      phone: hashedPhone,
      email: hashedEmail,
    };

    this.userRepository.create({ ...newDto, type: ITYPEUSER.USER }).then();
  }
}

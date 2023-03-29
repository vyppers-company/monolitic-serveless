import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IUserEntity } from '../entity/user.entity';
import { IRegisterUseCase } from '../interfaces/usecases/register.interface';

@Injectable()
export class RegisterService implements IRegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async register(dto: IUserEntity) {
    if (!dto.role) {
      throw new BadRequestException();
    }

    const hashedPhone = this.cryptoAdapter.encryptText(dto.phone);
    const hashedEmail = this.cryptoAdapter.encryptText(dto.email);
    const findedOne = await this.userRepository.findOne({
      $or: [
        {
          phone: hashedPhone,
          role: dto.role,
        },
        {
          role: dto.role,
          email: hashedEmail,
        },
      ],
    });

    if (findedOne) {
      throw new ConflictException();
    }

    const hashedPassword = this.cryptoAdapter.encryptText(dto.password);
    const hashedName = this.cryptoAdapter.encryptText(dto.name);

    const newDto = {
      ...dto,
      password: hashedPassword,
      name: hashedName,
      phone: hashedPhone,
      email: hashedEmail,
    };
    await this.userRepository.create({ ...newDto });
  }
}

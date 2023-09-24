import { ConflictException, Injectable } from '@nestjs/common';
import { CryptoAdapter } from '../../infra/adapters/cryptoAdapter';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IUserEntity } from '../entity/user.entity';
import { IRegisterUseCase } from '../interfaces/usecases/register.interface';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';

@Injectable()
export class RegisterService implements IRegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async register(dto: IUserEntity) {
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
          profileId: dto.profileId,
        },
      ],
    });

    if (findedOne) {
      throw new ConflictException();
    }

    const hashedPassword = this.cryptoAdapter.encryptText(
      dto.password,
      ICryptoType.USER,
    );
    const hashedName = this.cryptoAdapter.encryptText(
      dto.name,
      ICryptoType.USER,
    );

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

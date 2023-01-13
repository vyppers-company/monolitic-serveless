import { BadRequestException, Injectable } from '@nestjs/common';
import { CryptoAdapter } from 'src/infra/adapters/cryptoAdapter';
import { RegisterRepository } from '../../data/mongoose/repositories/register.repository';
import { IBffMsRegisterEntity } from '../entity/register.entity';
import { IRegisterUseCase } from '../interfaces/usecases/register.interface';

@Injectable()
export class RegisterService implements IRegisterUseCase {
  constructor(
    private readonly registerRepository: RegisterRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}

  async register(dto: IBffMsRegisterEntity) {
    if (!dto.role) {
      throw new BadRequestException('o tipo de usuário é obrigatório');
    }

    const hashedPhone = this.cryptoAdapter.encryptText(dto.phone);

    const findedOne = await this.registerRepository.findOne({
      phone: hashedPhone,
      role: dto.role,
    });

    if (findedOne) {
      throw new BadRequestException('este usuário já esta cadastrado');
    }

    const hashedPassword = this.cryptoAdapter.encryptText(dto.password);
    const hashedName = this.cryptoAdapter.encryptText(dto.name);

    const newDto = {
      ...dto,
      password: hashedPassword,
      name: hashedName,
      phone: hashedPhone,
    };
    await this.registerRepository.create({ ...newDto });
  }
}

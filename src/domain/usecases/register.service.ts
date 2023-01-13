import { BadRequestException, Injectable } from '@nestjs/common';
import { IBffMsRegisterEntity } from '../entity/register.entity';
import { hashPassword } from 'src/shared/utils/passwordHook.util';
import { UsersRepository } from '../../data/mongoose/repositories/register.repository';

@Injectable()
export class RegisterService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(dto: IBffMsRegisterEntity) {
    const findedOne = await this.usersRepository.findOne({
      phone: dto.phone,
    });

    if (findedOne) {
      throw new BadRequestException('este usuário já esta cadastrado');
    }

    const hashedPassword = hashPassword(dto.password);
    if (!dto.role) {
      throw new BadRequestException('o tipo de usuário é obrigatório');
    }

    const newDto = {
      ...dto,
      password: hashedPassword,
    };
    await this.usersRepository.create({ ...newDto });

    return 'Registrado com sucesso';
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CodeRepository } from '../../data/mongoose/repositories/code.repository';
import { CryptoAdapter } from '../../infra/adapters/cryptoAdapter';
import regex from '../../shared/helpers/regex';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IChangePasswordDto } from '../interfaces/others/change-password.interface';
import { IChangePasswordService } from '../interfaces/usecases/change-password.interface';

@Injectable()
export class ChangePasswordService implements IChangePasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly codeRecoveryRepository: CodeRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}
  async change(dto: IChangePasswordDto) {
    const isEmail = regex.email.test(dto.emailOrPhone);
    const isPhone = regex.celular.test(dto.emailOrPhone);

    const finalDto = {};

    if (isEmail) {
      const hashedEmail = this.cryptoAdapter.encryptText(dto.emailOrPhone);
      finalDto['email'] = hashedEmail;
    }

    if (isPhone) {
      const hashedPhone = this.cryptoAdapter.encryptText(dto.emailOrPhone);
      finalDto['phone'] = hashedPhone;
    }

    const findedOne = await this.userRepository.findOne(finalDto);

    if (!findedOne) {
      throw new NotFoundException();
    }

    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new ConflictException();
    }

    const code = await this.codeRecoveryRepository.findOne({
      code: dto.code,
      owner: findedOne._id,
    });

    if (!code) {
      throw new UnauthorizedException();
    }

    const hashedPassword = this.cryptoAdapter.encryptText(dto.newPassword);

    await this.userRepository.updateOne(findedOne, hashedPassword);

    await this.codeRecoveryRepository.deleteById(code._id);
  }
}

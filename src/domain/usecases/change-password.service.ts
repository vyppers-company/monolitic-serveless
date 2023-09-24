import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CodeRepository } from '../../data/mongoose/repositories/code.repository';
import { CryptoAdapter } from '../../infra/adapters/cryptoAdapter';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IChangePasswordDto } from '../interfaces/others/change-password.interface';
import { IChangePasswordService } from '../interfaces/usecases/change-password.interface';
import { decryptData } from 'src/shared/helpers/jwe-generator.helper';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';

@Injectable()
export class ChangePasswordService implements IChangePasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly codeRecoveryRepository: CodeRepository,
    private readonly cryptoAdapter: CryptoAdapter,
  ) {}
  async change(dto: IChangePasswordDto) {
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new ConflictException();
    }
    const decryptedCode = await decryptData(dto.tokenCode, ICryptoType.CODE);

    const code = await this.codeRecoveryRepository.findOne({
      _id: decryptedCode?._id,
    });

    if (!code) {
      throw new UnprocessableEntityException();
    }

    const findedOne = await this.userRepository.findOne({ _id: code.owner });

    const hashedPassword = this.cryptoAdapter.encryptText(
      dto.newPassword,
      ICryptoType.USER,
    );

    await this.userRepository.updateOne(findedOne, hashedPassword);

    await this.codeRecoveryRepository.deleteById(code._id);
  }
}

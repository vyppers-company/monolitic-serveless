import {
  UnprocessableEntityException,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { CodeRepository } from '../../data/mongoose/repositories/code.repository';
import { SendSmsAdapter } from '../../infra/adapters/blow-io.adapter';
import { CryptoAdapter } from '../../infra/adapters/cryptoAdapter';
import { environment } from '../../main/config/environment/environment';
import regex from '../../shared/helpers/regex';
import { generateCode } from '../../shared/utils/generateRandomicCode';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IRecoveryDto } from '../interfaces/others/recovery.interface';
import { IRcoveryUseCase } from '../interfaces/usecases/send-email.interface';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { SESAdapter } from 'src/infra/adapters/ses.adapter';
import { IValidationCodeType } from '../entity/code.entity';

@Injectable()
export class RecoveryService implements IRcoveryUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly codeRecoveryRepository: CodeRepository,
    private readonly cryptoAdapter: CryptoAdapter,
    private readonly sendSmsAdapter: SendSmsAdapter,
    private readonly sesAdapter: SESAdapter,
  ) {}
  async send(dto: IRecoveryDto) {
    const isEmail = regex.email.test(dto.emailOrPhone);
    const isPhone = regex.celular.test(dto.emailOrPhone);

    const finalDto = {};

    if (isEmail) {
      finalDto['email'] = this.cryptoAdapter.encryptText(
        dto.emailOrPhone,
        ICryptoType.USER,
      );
    }

    if (isPhone) {
      finalDto['phone'] = this.cryptoAdapter.encryptText(
        dto.emailOrPhone,
        ICryptoType.USER,
      );
    }

    const findedOne = await this.userRepository.findOne(finalDto);

    if (!findedOne) {
      throw new UnprocessableEntityException();
    }

    const existentCode = await this.codeRecoveryRepository.findOne({
      owner: findedOne._id,
    });

    if (!existentCode || existentCode.expiresIn < Date.now()) {
      const code = generateCode();

      await this.codeRecoveryRepository.upsertOne(existentCode, {
        code: code.value,
        owner: findedOne._id,
        expiresIn: Date.now() + environment.sendCode.expiration,
      });

      if (isEmail) {
        this.sesAdapter
          .sendEmailCode(
            dto.emailOrPhone,
            code.formated,
            IValidationCodeType.RECOVERY,
          )
          .then();
      }
      if (isPhone) {
        this.sendSmsAdapter
          .send(dto.emailOrPhone, code.formated, IValidationCodeType.RECOVERY)
          .then();
      }
    }
  }
  async sendNaoLogado(dto: IRecoveryDto) {
    const isEmail = regex.email.test(dto.emailOrPhone);
    const isPhone = regex.celular.test(dto.emailOrPhone);

    const finalDto = {} as { email: string; phone: string };

    if (isEmail) {
      finalDto['email'] = this.cryptoAdapter.encryptText(
        dto.emailOrPhone,
        ICryptoType.USER,
      );
    }

    if (isPhone) {
      finalDto['phone'] = this.cryptoAdapter.encryptText(
        dto.emailOrPhone,
        ICryptoType.USER,
      );
    }

    const findedOne = await this.userRepository.findOne(finalDto);

    if (findedOne) {
      throw new ConflictException('email or phone already exists');
    }
    const existentCode = await this.codeRecoveryRepository.findOne({
      owner: finalDto?.email ? finalDto.email : finalDto.phone,
    });

    if (!existentCode || existentCode.expiresIn < Date.now()) {
      const code = generateCode();

      await this.codeRecoveryRepository.upsertOne(existentCode, {
        code: code.value,
        owner: finalDto?.email ? finalDto.email : finalDto.phone,
        expiresIn: Date.now() + environment.sendCode.expiration,
        type: IValidationCodeType.REGISTER,
      });

      if (isEmail) {
        this.sesAdapter.sendEmailCode(
          dto.emailOrPhone,
          code.formated,
          IValidationCodeType.REGISTER,
        );
      }
      if (isPhone) {
        this.sendSmsAdapter.send(
          dto.emailOrPhone,
          code.formated,
          IValidationCodeType.REGISTER,
        );
      }
    }
  }
}

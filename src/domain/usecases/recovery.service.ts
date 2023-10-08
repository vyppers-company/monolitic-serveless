import { UnprocessableEntityException, Injectable } from '@nestjs/common';
import { CodeRepository } from '../../data/mongoose/repositories/code.repository';
import { SendSmsAdapter } from '../../infra/adapters/blow-io.adapter';
import { CryptoAdapter } from '../../infra/adapters/cryptoAdapter';
import { SendEmailAdapter } from '../../infra/adapters/mailgun.adapter';
import { environment } from '../../main/config/environment/environment';
import regex from '../../shared/helpers/regex';
import { generateCode } from '../../shared/utils/generateRandomicCode';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IRecoveryDto } from '../interfaces/others/recovery.interface';
import { IRcoveryUseCase } from '../interfaces/usecases/send-email.interface';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { SESAdapter } from 'src/infra/adapters/ses.adapter';

@Injectable()
export class RecoveryService implements IRcoveryUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly codeRecoveryRepository: CodeRepository,
    private readonly cryptoAdapter: CryptoAdapter,
    /*     private readonly sendEmailAdapter: SendEmailAdapter,
     */ private readonly sendSmsAdapter: SendSmsAdapter,
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
        expiresIn: Date.now() + environment.mail.expiration,
      });

      if (isEmail) {
        this.sesAdapter.sendEmailCode(dto.emailOrPhone, code.formated);
      }
      if (isPhone) {
        this.sendSmsAdapter.send(dto.emailOrPhone, code.formated);
      }
    }
  }
}

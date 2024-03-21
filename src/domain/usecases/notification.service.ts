import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CodeRepository } from '../../data/mongoose/repositories/code.repository';
import { CryptoAdapter } from '../../infra/adapters/crypto/cryptoAdapter';
import { environment } from '../../main/config/environment/environment';
import regex from '../../shared/helpers/regex';
import { generateCode } from '../../shared/utils/generateRandomicCode';
import { UserRepository } from '../../data/mongoose/repositories/user.repository';
import { IRecoveryDto } from '../interfaces/others/recovery.interface';
import { IRcoveryUseCase } from '../interfaces/usecases/send-email.interface';
import { ICryptoType } from '../interfaces/adapters/crypto.interface';
import { SESAdapter } from 'src/infra/adapters/aws/ses/ses.adapter';
import { IValidationCodeType } from '../entity/code.entity';
import { SNSAdapter } from 'src/infra/adapters/aws/sns/aws-sns.adapter';
import { templatesSMS } from 'src/shared/templates/smsTemplates';

@Injectable()
export class RecoveryService implements IRcoveryUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly codeRecoveryRepository: CodeRepository,
    private readonly cryptoAdapter: CryptoAdapter,
    private readonly snsAdapter: SNSAdapter,
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
      throw new HttpException(
        'Unprocessable Entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
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
        await this.sesAdapter.sendEmailCode(
          dto.emailOrPhone,
          code.formated,
          IValidationCodeType.RECOVERY,
        );
      }
      if (isPhone) {
        await this.snsAdapter.send(
          dto.emailOrPhone,
          code.formated,
          IValidationCodeType.RECOVERY,
        );
      }
      return code;
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
      throw new HttpException(
        'Unprocessable Entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
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
        this.snsAdapter.sendSms(
          dto.emailOrPhone,
          templatesSMS.REGISTER_USER.BODY(code.formated),
        );
      }
    }
  }
}

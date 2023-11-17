import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/data/mongoose/repositories/user.repository';
import { IValidateDataUseCase } from '../interfaces/usecases/validate-profile-id.interface';
import { SendSmsAdapter } from 'src/infra/adapters/blow-io.adapter';
import { generateCode } from 'src/shared/utils/generateRandomicCode';
import { IValidationCodeType } from '../entity/code.entity';
import { CodeRepository } from 'src/data/mongoose/repositories/code.repository';
import { environment } from 'src/main/config/environment/environment';
import { SESAdapter } from 'src/infra/adapters/ses.adapter';

@Injectable()
export class ValidateDataService implements IValidateDataUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sendSmsAdapter: SendSmsAdapter,
    private readonly codeRecoveryRepository: CodeRepository,
    private readonly sesAdapter: SESAdapter,
  ) {}

  async validatevypperId(vypperId: string, myId?: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      vypperId,
    });

    if (myId && user._id === myId) {
      return true;
    }

    return !user;
  }

  async validateEmail(email: string, myId: string): Promise<string> {
    const user = await this.userRepository.findOne({ email });

    if (user._id !== myId) {
      throw new BadRequestException('This phone have been used');
    }
    if (user._id === myId) {
      return 'phone is the same';
    }

    const existentCode = await this.codeRecoveryRepository.findOne({
      owner: myId,
      type: IValidationCodeType.CHANGE_EMAIL,
    });

    if (!existentCode || existentCode.expiresIn < Date.now()) {
      const code = generateCode();

      await this.codeRecoveryRepository.upsertOne(existentCode, {
        code: code.value,
        owner: myId,
        expiresIn: Date.now() + environment.sendCode.expiration,
        type: IValidationCodeType.CHANGE_EMAIL,
      });

      /*   await this.sesAdapter.sendEmailCode(email, 'body', 'subject'); */

      return 'one email was sent';
    }
  }
  async validatePhone(phone: string, myId: string): Promise<string> {
    const user = await this.userRepository.findOne({ phone });

    if (user._id !== myId) {
      throw new BadRequestException('This phone have been used');
    }
    if (user._id === myId) {
      return 'phone is the same';
    }

    const existentCode = await this.codeRecoveryRepository.findOne({
      owner: myId,
      type: IValidationCodeType.CHANGE_PHONE,
    });

    if (!existentCode || existentCode.expiresIn < Date.now()) {
      const code = generateCode();

      await this.codeRecoveryRepository.upsertOne(existentCode, {
        code: code.value,
        owner: myId,
        expiresIn: Date.now() + environment.sendCode.expiration,
        type: IValidationCodeType.CHANGE_PHONE,
      });

      /*  await this.sendSmsAdapter.send(phone, 'body-template'); */

      return 'one sms was sent';
    }
  }
}

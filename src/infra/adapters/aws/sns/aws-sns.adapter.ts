import { HttpException, Inject, Injectable } from '@nestjs/common';
import { SNS } from 'aws-sdk';
import { IValidationCodeType } from 'src/domain/entity/code.entity';
import { ISendRecoveryCode } from 'src/domain/interfaces/adapters/send-recovery-code.interface';

@Injectable()
export class SNSAdapter implements ISendRecoveryCode {
  constructor(@Inject('sns') private readonly sns: SNS) {}
  send(to: string, code: string, type: IValidationCodeType) {
    try {
      this.sns.publish(
        {
          Message: `Vyppers: Não compartilhe, Seu código de recuperação de senha ${code}`,
          PhoneNumber: `+55${to}`,
        },
        (err, data) => {
          console.log({
            err,
            data,
            to: `+55${to}`,
            Message: `Vyppers: Não compartilhe, Seu código de recuperação de senha ${code}`,
          });
        },
      );
    } catch (error) {
      throw new HttpException(error?.Error || 'Internal Server Error', 500);
    }
  }
  sendSms(to: string, template: string) {
    try {
      this.sns.publish(
        {
          Message: template,
          PhoneNumber: `+55${to}`,
        },
        (err, data) => {
          console.log({ err, data, to: `+55${to}`, template });
        },
      );
    } catch (error) {
      throw new HttpException(error?.Error || 'Internal Server Error', 500);
    }
  }
}

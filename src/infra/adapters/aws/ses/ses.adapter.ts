import { ISendEmailAdapter } from 'src/domain/interfaces/adapters/send-email.interface';
import { SES, SendEmailCommand } from '@aws-sdk/client-ses';
import { IValidationCodeType } from 'src/domain/entity/code.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SESAdapter implements ISendEmailAdapter {
  constructor(@Inject('ses') private readonly sesAdapter: SES) {}
  async sendEmailCode(
    to: string,
    code: string,
    type: IValidationCodeType,
  ): Promise<void> {
    await this.sesAdapter.send(
      new SendEmailCommand({
        Source: 'customer.service@vyppers.com',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Body: {
            Html: {
              Data:
                type === IValidationCodeType.RECOVERY
                  ? `<h1>Aqui está seu codigo: ${code} de recuperação válido por 1 minuto e meio</h1>`
                  : `<h1>Seja bem vindo a Vyppers, estamos feliz de ter você por aqui.</h1><br>
                     <h1>Aqui está seu codigo: ${code} de cadastro é válido por 1 minuto e meio</h1>`,
              Charset: 'utf-8',
            },
          },
          Subject: {
            Data:
              type === IValidationCodeType.RECOVERY
                ? 'Vyppers - Mudança de Senha'
                : 'Vyppers - Bem Vindo',
            Charset: 'utf-8',
          },
        },
      }),
    );
  }
  async sendEmail(to: string, title: string, template: string) {
    await this.sesAdapter.send(
      new SendEmailCommand({
        Source: 'customer.service@vyppers.com',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Body: {
            Html: {
              Data: template,
              Charset: 'utf-8',
            },
          },
          Subject: {
            Data: title,
            Charset: 'utf-8',
          },
        },
      }),
    );
  }
}

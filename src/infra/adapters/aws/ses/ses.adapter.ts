import { ISendEmailAdapter } from 'src/domain/interfaces/adapters/send-email.interface';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { environment } from 'src/main/config/environment/environment';
import { IValidationCodeType } from 'src/domain/entity/code.entity';

const ses = new SESClient({
  region: environment.aws.region,
  credentials: {
    accessKeyId: environment.aws.clientId,
    secretAccessKey: environment.aws.secretKey,
  },
});

export class SESAdapter implements ISendEmailAdapter {
  async sendEmailCode(
    to: string,
    code: string,
    type: IValidationCodeType,
  ): Promise<void> {
    await ses.send(
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
}

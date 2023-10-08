import { ISendEmailAdapter } from 'src/domain/interfaces/adapters/send-email.interface';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({
  region: 'sa-east-1',
  credentials: {
    accessKeyId: 'AKIAUGGA4HKC7LI42C6O',
    secretAccessKey: '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',
  },
});

export class SESAdapter implements ISendEmailAdapter {
  async sendEmailCode(to: string, code: string): Promise<void> {
    await ses.send(
      new SendEmailCommand({
        Source: 'customer.service@vyppers.com',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Body: {
            Html: {
              Data: `<h1>Aqui está seu codigo: ${code} de recuperação válido por 1 minuto e meio</h1>`,
              Charset: 'utf-8',
            },
          },
          Subject: {
            Data: 'Vyppers - MUDANÇA DE SENHA',
            Charset: 'utf-8',
          },
        },
      }),
    );
  }
}

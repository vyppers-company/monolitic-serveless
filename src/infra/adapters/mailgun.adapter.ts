import { ISendRecoveryCode } from '../../domain/interfaces/adapters/send-recovery-code.interface';
import mailgun from 'mailgun-js';
import { environment } from '../../main/config/environment';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
export class SendEmailAdapter implements ISendRecoveryCode {
  send(to: string, code: string) {
    const mg = mailgun({
      apiKey: environment.mail.apiKey,
      domain: environment.mail.domain,
    });

    mg.messages().send(
      {
        from: `${environment.mail.from}`,
        to: `${to}`,
        subject: 'FINBOT - MUDANÇA DE SENHA',
        text: `<h1>Aqui está seu codigo: ${code} de recuperação válido por 10 minutos</h1>`,
      },
      function (error: any) {
        if (error) {
          throw new InternalServerErrorException(error);
        }
      },
    );
  }
}

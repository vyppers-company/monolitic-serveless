import { ISendRecoveryCode } from '../../domain/interfaces/adapters/send-recovery-code.interface';
import * as mailgun from 'mailgun-js';
import { environment } from '../../main/config/environment';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
export class SendEmailAdapter implements ISendRecoveryCode {
  send(to: string, code: string) {
    try {
      const mg = mailgun({
        apiKey: environment.mail.apiKey,
        domain: environment.mail.domain,
      });

      mg.messages().send({
        from: `${environment.mail.from}`,
        to: `${to}`,
        subject: 'FINBOT - MUDANÇA DE SENHA',
        html: `<h1>Aqui está seu codigo: ${code} de recuperação válido por 1 minuto e meio</h1>`,
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}

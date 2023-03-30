import axios from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import { ISendRecoveryCode } from '../../domain/interfaces/adapters/send-recovery-code.interface';
import { environment } from '../../main/config/environment';
export class SendSmsAdapter implements ISendRecoveryCode {
  async send(to: string, code: string) {
    try {
      await axios.post(
        environment.sms.apiUrl,
        {
          to: `+55${to}`,
          message: `Finbot: Não compartilhe, Seu código de recuperação de senha ${code}`,
        },
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Accepts: 'application/json',
          },
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

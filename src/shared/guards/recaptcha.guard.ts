import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
import { environment } from 'src/main/config/environment/environment';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const recaptchaToken = request.headers['x-recaptcha-token'];

    if (!recaptchaToken) {
      throw new HttpException(
        'Recaptcha token is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await axios.post(environment.captcha.verifyUrl, null, {
        params: {
          secret: environment.captcha.secret,
          response: recaptchaToken,
        },
      });

      if (!response.data.success || response.data.score < 0.5) {
        throw new HttpException(
          'Recaptcha validation failed',
          HttpStatus.FORBIDDEN,
        );
      }

      return true;
    } catch (error) {
      throw new HttpException(
        'Recaptcha validation failed',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}

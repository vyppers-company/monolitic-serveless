import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { environment } from '../../main/config/environment/environment';
import { scryptSync } from 'node:crypto';
import { jwtDecrypt } from 'jose';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      if (
        !request.headers.authorization ||
        request.headers.authorization === undefined
      ) {
        throw new UnauthorizedException();
      }

      const authorization =
        (request.headers.authorization || '').split(' ')[1] || '';

      const {
        cryptoData: { keyPassUser, keySalt, keyLength },
      } = environment;

      const key = scryptSync(keyPassUser, keySalt, keyLength);
      const decrypted = await jwtDecrypt(authorization, key);

      if (!decrypted.payload) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}

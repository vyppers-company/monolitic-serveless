import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { environment } from '../../main/config/environment/environment';
import { scryptSync } from 'node:crypto';
import { jwtDecrypt } from 'jose';

export const InternalUserLogged = createParamDecorator(
  async (data: unknown, context: ExecutionContext): Promise<any> => {
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
        cryptoData: { keyPassInternalUser, keySalt, keyLength },
      } = environment;
      const key = scryptSync(keyPassInternalUser, keySalt, keyLength);
      const decrypted = await jwtDecrypt(authorization, key);

      if (!decrypted?.payload) {
        throw new UnauthorizedException();
      }

      return decrypted.payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
  },
);

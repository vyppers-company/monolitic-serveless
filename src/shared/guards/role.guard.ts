import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { environment } from '../../main/config/environment';
import { DecodedJwt } from '../../domain/interfaces/others/jwt.interface';
import { Role } from '../../domain/interfaces/others/role.interface';

@Injectable()
export class InternalsRole implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      if (
        !request.headers.authorization ||
        request.headers.authorization === undefined
      ) {
        throw new UnauthorizedException('não autorizado');
      }

      const authorization =
        (request.headers.authorization || '').split(' ')[1] || '';

      const decoded = jwt.verify(
        authorization as string,
        environment.secret.jwt,
      ) as DecodedJwt;

      if (decoded.data.role !== Role.ADMIN) {
        throw new UnauthorizedException(
          'este tipo de usuário não está autorizado',
        );
      }
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ForbiddenException('sessão expirada');
      }
      throw new BadRequestException(err);
    }
  }
}

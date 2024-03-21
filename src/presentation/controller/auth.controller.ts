import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, AuthInternalDto } from '../dtos/auth.dto';
import { AuthService } from '../../domain/usecases/auth.service';
import { GoogleAuthStrategy } from '../../domain/usecases/google-strategy.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IProfile } from 'src/domain/entity/user.entity';
import { environment } from 'src/main/config/environment/environment';
import { AuthInternalUserService } from 'src/domain/usecases/auth-internal-user.service';
import { IAuthInternalUser } from 'src/domain/interfaces/others/auth-internal.interface';
import { AuthGoogleDto } from '../dtos/auth-google';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authInternalService: AuthInternalUserService,
    private readonly googleService: GoogleAuthStrategy,
  ) {}

  @Post('v1/common')
  async auth(@Body() dto: Auth) {
    return await this.authService.auth(dto);
  }

  @Post('v1/internal-user')
  async authInternalUser(@Body() dto: AuthInternalDto) {
    return await this.authInternalService.authInternal(dto);
  }

  @Post('v1/google')
  @ApiOperation({ summary: 'nao chamar, que chama é o google como callback' })
  @ApiBody({ type: AuthGoogleDto })
  async authGoogleRedirect(@Body() dto: AuthGoogleDto) {
    return await this.googleService.validate(dto);
  }
}

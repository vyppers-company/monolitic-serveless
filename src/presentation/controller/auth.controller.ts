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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, AuthInternalDto } from '../dtos/auth.dto';
import { AuthService } from '../../domain/usecases/auth.service';
import { GoogleAuthStrategy } from '../../domain/usecases/google-strategy.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IProfile } from 'src/domain/entity/user.entity';
import { environment } from 'src/main/config/environment/environment';
import { AuthInternalUserService } from 'src/domain/usecases/auth-internal-user.service';
import { IAuthInternalUser } from 'src/domain/interfaces/others/auth-internal.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger: Logger;
  constructor(
    private readonly authService: AuthService,
    private readonly authInternalService: AuthInternalUserService,
    private readonly google: GoogleAuthStrategy,
  ) {
    this.logger = new Logger();
  }

  @Post('v1/common')
  async auth(@Body() dto: Auth) {
    return await this.authService.auth(dto);
  }

  @Post('v1/internal-user')
  async authInternalUser(@Body() dto: AuthInternalDto) {
    return await this.authInternalService.authInternal(dto);
  }

  @Get('v1/google')
  @ApiOperation({
    summary:
      'chamar dentro de um iframe, regra: se nao tiver ele cria, porem depois precisa completar alguns dados (A DEFINIR)',
  })
  @UseGuards(AuthGuard('google'))
  async authGoogle() {
    return;
  }

  @Get('v1/google/redirect')
  @ApiOperation({ summary: 'nao chamar, que chama é o google como callback' })
  @UseGuards(AuthGuard('google'))
  async authGoogleRedirect(@Req() request: Request, @Res() response: Response) {
    const user = request.user as IProfile;
    const data = await this.authService.loginOauth20(user);
    response.setHeader('token', data.token);
    response.setHeader('info', JSON.stringify(data.info));
    response.redirect(environment.oauth.redirectFrontUrl);
  }

  @Get('v1/facebook')
  @ApiOperation({
    summary:
      'chamar dentro de um iframe, regra: se nao tiver ele cria, porem depois precisa completar alguns dados (A DEFINIR)',
  })
  @UseGuards(AuthGuard('facebook'))
  async authFacebook() {
    return;
  }

  @Get('v1/facebook/redirect')
  @ApiOperation({ summary: 'nao chamar, que chama é o facebook como callback' })
  @UseGuards(AuthGuard('facebook'))
  async authFacebookRedirect(
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = request.user as IProfile;
    const data = await this.authService.loginOauth20(user);
    response.setHeader('token', data.token);
    response.setHeader('info', JSON.stringify(data.info));
    response.redirect(environment.oauth.redirectFrontUrl);
  }
}

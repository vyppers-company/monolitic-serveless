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
import { Auth } from '../dtos/auth.dto';
import { AuthService } from '../../domain/usecases/auth.service';
import { GoogleAuthStrategy } from '../../domain/usecases/google-strategy.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { IProfile } from 'src/domain/entity/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger: Logger;
  constructor(
    private readonly authService: AuthService,
    private readonly google: GoogleAuthStrategy,
  ) {
    this.logger = new Logger();
  }

  @Post('v1/common')
  async auth(@Body() dto: Auth) {
    return await this.authService.auth(dto);
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
    response.redirect(
      'https://vyppers-frontend-dev-b5731e40cfe1.herokuapp.com',
    );
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
    response.redirect(
      'https://vyppers-frontend-dev-b5731e40cfe1.herokuapp.com',
    );
  }
}

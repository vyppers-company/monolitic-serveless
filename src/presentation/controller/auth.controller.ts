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
import { GoogleAuthStrategy } from 'src/domain/usecases/google-strategy.service';
import { Request } from 'express';
import { GoogleOAuthGuard } from 'src/shared/guards/google.guard';

interface IProfile {
  email: string;
  name: string;
  profileImage: string;
}

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
  @UseGuards(GoogleOAuthGuard)
  async authGoogle() {
    return;
  }

  @Get('v1/google/redirect')
  @ApiOperation({ summary: 'nao chamar, que chama é o google como callback' })
  @UseGuards(GoogleOAuthGuard)
  async authGoogleRedirect(@Req() request: Request) {
    const user = request.user as IProfile;
    return this.google.login(user);
  }
}

import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../dtos/auth.dto';
import { AuthService } from '../../domain/usecases/auth.service';

@ApiTags('login')
@Controller('login')
export class AuthController {
  private logger: Logger;
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger();
  }

  @Post('v1')
  async auth(@Body() dto: Auth) {
    return await this.authService.auth(dto);
  }
}

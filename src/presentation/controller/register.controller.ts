import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { RegisterDto } from '../dtos/register.dto';
import { RegisterService } from '../../domain/usecases/register.service';

@ApiTags('register')
@Controller('register')
export class RegisterController {
  private logger: Logger;
  constructor(private readonly registerService: RegisterService) {
    this.logger = new Logger();
  }

  @Post('v1/user')
  @ApiBody({ type: RegisterDto })
  async customer(@Body() dto: RegisterDto) {
    return await this.registerService.register(dto);
  }
}

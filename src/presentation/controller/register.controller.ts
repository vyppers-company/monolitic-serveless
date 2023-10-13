import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { RegisterDto, RegisterDtoMinimal } from '../dtos/register.dto';
import { RegisterService } from '../../domain/usecases/register.service';
import { RegisterMinimalService } from 'src/domain/usecases/register-minimal.service';

@Controller('register')
export class RegisterController {
  private logger: Logger;
  constructor(
    private readonly registerService: RegisterService,
    private readonly registerMinimalService: RegisterMinimalService,
  ) {
    this.logger = new Logger();
  }

  @ApiTags('register')
  @Post('v1/user')
  @ApiBody({ type: RegisterDto })
  async customer(@Body() dto: RegisterDto) {
    return await this.registerService.register(dto);
  }

  @ApiTags('register')
  @Post('v1/user/minimal')
  @ApiBody({ type: RegisterDtoMinimal })
  async customerMinimal(@Body() dto: RegisterDtoMinimal) {
    return await this.registerMinimalService.registerMinimal(dto);
  }
}

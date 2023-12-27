import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import {
  RegisterDto,
  RegisterDtoInternalUsers,
  RegisterDtoMinimal,
} from '../dtos/register.dto';
import { RegisterService } from '../../domain/usecases/register.service';
import { RegisterMinimalService } from 'src/domain/usecases/register-minimal.service';
import { RegisterInternalUserService } from 'src/domain/usecases/register-internal-user.service';
import { ILoggedInternalUser } from 'src/domain/interfaces/others/logged.interface';
import { InternalUserLogged } from 'src/shared/decorators/internal-user-logged';

@Controller('register')
export class RegisterController {
  private logger: Logger;
  constructor(
    private readonly registerService: RegisterService,
    private readonly registerInternalUserService: RegisterInternalUserService,
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

  @ApiTags('register')
  @Post('v1/internal-user')
  @ApiBearerAuth()
  @ApiBody({ type: RegisterDtoInternalUsers })
  async employee(
    @Body() dto: RegisterDtoInternalUsers,
    @InternalUserLogged() internalUserLogged: ILoggedInternalUser,
  ) {
    return await this.registerInternalUserService.registerInternalUser(
      dto,
      internalUserLogged,
    );
  }
}

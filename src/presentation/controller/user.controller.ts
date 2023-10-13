import { Controller, Logger, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ArrobaDto } from '../dtos/validate-profile-id';
import { ValidateArrobaService } from 'src/domain/usecases/validate-profile-id.service';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { GetProfileService } from 'src/domain/usecases/get-profile.service';

@Controller('user')
export class UserController {
  private logger: Logger;
  constructor(
    private readonly validateArroba: ValidateArrobaService,
    private readonly getProfileService: GetProfileService,
  ) {
    this.logger = new Logger();
  }

  @ApiTags('profile')
  @Get('v1/info/home')
  @ApiBearerAuth()
  async getProfile(@Logged() logged: ILogged) {
    return await this.getProfileService.getPersonalData(logged);
  }

  @ApiTags('validate')
  @Get('v1/validate/arroba')
  @ApiQuery({ name: 'arroba', required: true })
  async validateArrobaFs(@Query() validate: ArrobaDto) {
    return await this.validateArroba.validate(validate.arroba);
  }
}

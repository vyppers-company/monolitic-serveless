import { Controller, Logger, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { ProfileIdDto } from '../dtos/validate-profile-id';
import { ValidateProfileIdService } from 'src/domain/usecases/validate-profile-id.service';

@Controller('user')
export class UserController {
  private logger: Logger;
  constructor(
    private readonly validateProfileIdService: ValidateProfileIdService,
  ) {
    this.logger = new Logger();
  }

  @ApiTags('validate')
  @Get('v1/validate-profile-id')
  @ApiQuery({ name: 'profileId', required: true })
  async validateProfileId(@Query() validate: ProfileIdDto) {
    return await this.validateProfileIdService.validate(validate.profileId);
  }
}

import { Controller, Logger, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { UserService } from 'src/domain/usecases/user.service';
import { ProfileIdDto } from '../dtos/validate-profile-id';
import { ValidateProfileIdService } from 'src/domain/usecases/validate-profile-id.service';

@Controller('user')
export class UserController {
  private logger: Logger;
  constructor(
    private readonly userService: UserService,
    private readonly validateProfileIdService: ValidateProfileIdService,
  ) {
    this.logger = new Logger();
  }

  @ApiTags('profile')
  @Get('v1/profile')
  @ApiBearerAuth()
  async getProfile(@Logged() logged: ILogged) {
    return await this.userService.getPersonalData(logged);
  }

  @ApiTags('validate')
  @Get('v1/validate-profile-id')
  @ApiQuery({ name: 'profileId', required: true })
  async validateProfileId(@Query() validate: ProfileIdDto) {
    return await this.validateProfileIdService.validate(validate.profileId);
  }
}

import { Controller, Logger, Get, Query, Body, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ValidatevypperIdDto } from '../dtos/validate-profile-id';
import { ValidateDataService } from 'src/domain/usecases/validate-profile-id.service';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { GetProfileService } from 'src/domain/usecases/get-profile.service';
import { UpdateProfileService } from 'src/domain/usecases/update-profile.service';
import { ValidateMissingDataProfileService } from 'src/domain/usecases/validate-missing-profile-data.service';
import { ProfileDto } from '../dtos/profile.dto';

@Controller('user')
export class UserController {
  private logger: Logger;
  constructor(
    private readonly validateData: ValidateDataService,
    private readonly getProfileService: GetProfileService,
    private readonly updateProfile: UpdateProfileService,
    private readonly validateCompleteProfile: ValidateMissingDataProfileService,
  ) {
    this.logger = new Logger();
  }

  @ApiTags('profile')
  @Get('v1/info/home')
  @ApiBearerAuth()
  async getProfile(@Logged() logged: ILogged) {
    return await this.getProfileService.getPersonalData(logged);
  }

  @ApiTags('profile')
  @Get('v1/missing-data')
  @ApiBearerAuth()
  async validateProfile(@Logged() user: ILogged) {
    return await this.validateCompleteProfile.validateMissingDatas(user._id);
  }

  @ApiTags('profile/validate/opend')
  @Get('v1/validate/vypperId')
  @ApiQuery({ name: 'vypperId', required: true })
  async validatevypperIdFs(@Query() validate: ValidatevypperIdDto) {
    return await this.validateData.validatevypperId(validate.vypperId);
  }

  @ApiTags('profile/validate')
  @Get('v1/validate/vypperId/logged')
  @ApiBearerAuth()
  @ApiQuery({ name: 'vypperId', required: true })
  async validatevypperIdFsLogged(
    @Query() validate: ValidatevypperIdDto,
    @Logged() user: ILogged,
  ) {
    return await this.validateData.validatevypperId(
      validate.vypperId,
      user._id,
    );
  }

  @ApiTags('profile/update/common/data')
  @Patch('v1/update/profile')
  @ApiBearerAuth()
  @ApiBody({ type: ProfileDto })
  async updateCommonData(@Body() body: ProfileDto, @Logged() user: ILogged) {
    await this.updateProfile.updateData(user._id, body);
  }
}

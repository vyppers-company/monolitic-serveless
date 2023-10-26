import {
  Controller,
  Logger,
  Get,
  Query,
  Put,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  ValidateArrobaDto,
  ValidateEmailDto,
  ValidatePhoneDto,
} from '../dtos/validate-profile-id';
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
  @Get('v1/validate/arroba')
  @ApiQuery({ name: 'arroba', required: true })
  async validateArrobaFs(@Query() validate: ValidateArrobaDto) {
    return await this.validateData.validateArroba(validate.arroba);
  }

  @ApiTags('profile/validate')
  @Get('v1/validate/arroba/logged')
  @ApiBearerAuth()
  @ApiQuery({ name: 'arroba', required: true })
  async validateArrobaFsLogged(
    @Query() validate: ValidateArrobaDto,
    @Logged() user: ILogged,
  ) {
    return await this.validateData.validateArroba(validate.arroba, user._id);
  }

  /* @ApiTags('profile/validate')
  @Get('v1/validate/email/logged')
  @ApiBearerAuth()
  @ApiQuery({ name: 'email', required: true })
  async validateAEmail(
    @Query() validate: ValidateEmailDto,
    @Logged() user: ILogged,
  ) {
    return await this.validateData.validateEmail(validate.email, user._id);
  }

  @ApiTags('profile/validate')
  @Get('v1/validate/phone/logged')
  @ApiBearerAuth()
  @ApiQuery({ name: 'phone', required: true })
  async validatePhone(
    @Query() validate: ValidatePhoneDto,
    @Logged() user: ILogged,
  ) {
    return await this.validateData.validatePhone(validate.phone, user._id);
  } */

  @ApiTags('profile/update/common/data')
  @Patch('v1/update/profile')
  @ApiBearerAuth()
  @ApiBody({ type: ProfileDto })
  async updateCommonData(@Body() body: ProfileDto, @Logged() user: ILogged) {
    await this.updateProfile.updateData(user._id, body);
  }
  /* 
  @ApiTags('profile/update/email')
  @Put('v1/update/email')
  @ApiQuery({ name: 'email', required: true })
  @ApiBearerAuth()
  async updateEmail(@Query() emailToken: string, @Logged() user: ILogged) {
    await this.updateProfile.updateEmail(user._id, emailToken);
  }

  @ApiTags('profile/update/phone')
  @Put('v1/update/phone')
  @ApiQuery({ name: 'phone', required: true })
  @ApiBearerAuth()
  async updatePhone(@Query() phoneToken: string, @Logged() user: ILogged) {
    await this.updateProfile.updatePhone(user._id, phoneToken);
  }
 */
  /*  @ApiTags('profile')
  @Delete('v1/remove/phone')
  @ApiBearerAuth()
  async removeDevice(@Logged() user: ILogged) {
    await this.updateProfile.removeDevice(user._id);
  }

  @ApiTags('profile')
  @Delete('v1/remove/email')
  @ApiBearerAuth()
  async removeEmail(@Logged() user: ILogged) {
    await this.updateProfile.removeEmail(user._id);
  }

  @ApiTags('profile')
  @Delete('v1/delete/account')
  @ApiBearerAuth()
  async removeAccount(@Logged() user: ILogged) {
    await this.updateProfile.removeAccount(user._id);
  }

  @ApiTags('profile')
  @Delete('v1/freeze/account')
  @ApiBearerAuth()
  @ApiQuery({ name: 'phone', required: true })
  async freezeAccount(@Logged() user: ILogged) {
    await this.updateProfile.freezeAccount(user._id);
  }

  @ApiTags('profile')
  @Post('v1/freeze-or-delete-account/reason')
  @ApiBearerAuth()
  @ApiQuery({ name: 'reason', required: true })
  async reasonToFreezeOrDeleteAccount(
    @Query('reason') reason: string,
    @Logged() user: ILogged,
  ) {
    await this.updateProfile.reasonToFreezeOrDeleteAccount(user._id, reason);
  } */
}

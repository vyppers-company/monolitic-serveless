import {
  Controller,
  Get,
  Query,
  Body,
  Patch,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ValidatevypperIdDto } from '../dtos/validate-profile-id';
import { ValidateDataService } from 'src/domain/usecases/validate-profile-id.service';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { GetProfileService } from 'src/domain/usecases/get-profile.service';
import { UpdateProfileService } from 'src/domain/usecases/update-profile.service';
import { ValidateMissingDataProfileService } from 'src/domain/usecases/validate-missing-profile-data.service';
import { EditEmailDto, EditPasswordDto, ProfileDto } from '../dtos/profile.dto';
import { RecaptchaGuard } from 'src/shared/guards/recaptcha.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly validateData: ValidateDataService,
    private readonly getProfileService: GetProfileService,
    private readonly updateProfile: UpdateProfileService,
    private readonly validateCompleteProfile: ValidateMissingDataProfileService,
  ) {}

  @ApiTags('profile')
  @Get('v1/info/home')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'userId',
    required: true,
  })
  async getProfile(@Logged() logged: ILogged, @Query('userId') userId: string) {
    if (!userId) {
      throw new HttpException(
        'userId query param is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.getProfileService.getPersonalData(userId, logged._id);
  }

  @ApiTags('profile')
  @Get('v1/sharelink')
  @ApiQuery({
    name: 'vId',
    required: true,
    description: 'arroba do usuario que esta compartilhando a pagina publica',
  })
  @ApiHeader({
    name: 'x-recaptcha-token',
    description: 'response of challenge on frontend',
    required: true,
  })
  @UseGuards(RecaptchaGuard)
  async sharePofile(@Query('vId') vId: string) {
    if (!vId) {
      throw new HttpException(
        'userId query param is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.getProfileService.publicProfile(vId);
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

  @ApiTags('profile/update')
  @Patch('v1/update/profile')
  @ApiBearerAuth()
  @ApiBody({ type: ProfileDto })
  async updateCommonData(@Body() body: ProfileDto, @Logged() user: ILogged) {
    await this.updateProfile.updateData(user._id, body);
  }
  @ApiTags('profile/update')
  @Patch('v1/update/email')
  @ApiBearerAuth()
  @ApiBody({ type: EditEmailDto })
  async updateEmail(@Body() body: EditEmailDto, @Logged() user: ILogged) {
    return { body, user };
  }
  @ApiTags('profile/update')
  @Patch('v1/update/password')
  @ApiBearerAuth()
  @ApiBody({ type: EditPasswordDto })
  async updatePassword(@Body() body: EditPasswordDto, @Logged() user: ILogged) {
    return { body, user };
  }
}

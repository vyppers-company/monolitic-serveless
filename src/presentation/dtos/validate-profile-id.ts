import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import regex from '../../shared/helpers/regex';
import { IValidateProfileId } from 'src/domain/interfaces/others/validate-profile-id.interface';

export class ProfileIdDto implements IValidateProfileId {
  @IsString()
  @ApiProperty({ required: true, example: '@paulorr.io igual de instagram' })
  @Matches(regex.profileId, {
    message: 'id profile format invalid',
  })
  profileId: string;
}

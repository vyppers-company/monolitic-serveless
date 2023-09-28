import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsISO8601,
  IsString,
  IsUrl,
  Matches,
  isISO8601,
} from 'class-validator';
import regex from '../../shared/helpers/regex';
import { Match } from '../../shared/decorators/match.decorator';
import { IAccess } from '../../domain/entity/user.entity';

export class RegisterDto implements IAccess {
  @IsString()
  @ApiProperty({ required: true, example: 'Maria eugenia' })
  name: string;

  @IsString()
  @ApiProperty({ required: true, example: '@paulorr.io' })
  @Matches(regex.profileId, { message: 'invalid profileId format' })
  profileId: string;

  @IsString()
  @ApiProperty({ required: true, example: '13996063278' })
  @Matches(regex.celular, { message: 'invalid phone number format' })
  phone: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ required: true, example: 'email@email.com' })
  email: string;

  @IsString()
  @ApiProperty({ required: true, example: 'userPassword@2022' })
  @Matches(regex.senhaForte, {
    message: 'invalid minimum format  password',
  })
  password: string;

  @IsString()
  @Match('password')
  @ApiProperty({ required: true, example: 'userPassword@2022' })
  passwordConfirm: string;

  @Matches(regex.iso8601, { message: 'invalid birthday format' })
  @ApiProperty({ required: true, example: '1991-06-01T00:00:00Z' })
  birthday: string;

  @ApiProperty({
    required: true,
    example: true,
    description: 'just allow if the value is true',
  })
  @IsBoolean({ message: 'is required' })
  termsAndConditions: boolean;
}

export class RegisterDtoCandidates {}

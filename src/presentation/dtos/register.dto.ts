import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import regex from '../../shared/helpers/regex';
import { Match } from '../../shared/decorators/match.decorator';
import { IUserEntity } from '../../domain/entity/user.entity';

export class RegisterDto implements IUserEntity {
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
}

export class RegisterDtoCandidates {}

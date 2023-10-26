import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import regex from '../../shared/helpers/regex';
import { Match } from '../../shared/decorators/match.decorator';
import { IProfile } from '../../domain/entity/user.entity';

export class RegisterDto implements IProfile {
  @IsString()
  @ApiProperty({ required: true, example: 'Maria eugenia' })
  name: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'paulorr.io',
    description: 'mandar sem @ no inicio',
  })
  vypperID: string;

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

export class RegisterDtoMinimal implements IProfile {
  @IsString()
  @ApiProperty({ required: false, example: '13996063278' })
  @IsOptional()
  @Matches(regex.celular, { message: 'invalid phone number format' })
  phone?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false, example: 'email@email.com' })
  email?: string;

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

  @ApiProperty({
    required: true,
    example: true,
    description: 'just allow if the value is true',
  })
  @IsBoolean({ message: 'is required' })
  termsAndConditions: boolean;

  @IsString()
  @ApiProperty({ required: true, example: 'token_here' })
  tokenCode: string;
}

export class RegisterDtoCandidates {}

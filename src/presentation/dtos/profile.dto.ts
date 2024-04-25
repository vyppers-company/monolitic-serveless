import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  ICategoryBiotype,
  ICategoryEthnicity,
  ICategoryEyes,
  ICategoryGender,
  ICategoryHair,
} from 'src/domain/entity/category';
import { ICaracteristicas, IProfile } from 'src/domain/entity/user.entity';
import regex from 'src/shared/helpers/regex';

export class InterestsDto {
  @IsEnum(ICategoryGender, { each: true })
  @ApiProperty({
    required: true,
    enum: ICategoryGender,
    example: [ICategoryGender.F],
  })
  @IsOptional()
  gender?: ICategoryGender[];
}

export class EditEmailDto implements Pick<IProfile, 'email'> {
  @ApiProperty({
    required: true,
    description: 'current email used to register',
    example: 'email@email.com',
  })
  @IsEmail()
  email: string;
}
export class EditPasswordDto implements Pick<IProfile, 'password'> {
  @ApiProperty({
    required: true,
    description: 'current password',
    example: 'myPassword@123',
  })
  @Matches(regex.senhaForte, {
    message: 'invalid minimum format  password',
  })
  password: string;

  @ApiProperty({
    required: true,
    description: 'new password',
    example: 'myNewPassword@123',
  })
  @Matches(regex.senhaForte, {
    message: 'invalid minimum format  password',
  })
  newPassword: string;
}

export interface IProfileExtended extends Omit<IProfile, 'isPublic'> {
  isPublic?: string;
}
export class ProfileDto implements IProfileExtended {
  @IsString()
  @ApiProperty({ required: false, example: 'Fulana ' })
  @IsOptional()
  name?: string;
  @IsString()
  @MaxLength(256)
  @IsOptional()
  @ApiProperty({ required: false, example: 'visite meu perfil' })
  bio?: string;
  @IsString()
  @IsOptional()
  @Matches(regex.vypperId, { message: 'invalida format vypperId' })
  @ApiProperty({ required: false, example: 'fulana' })
  vypperId?: string;
  @IsISO8601()
  @IsOptional()
  @ApiProperty({ required: false, example: '1991-01-01T00:00:00.000Z' })
  birthday?: string;

  @ApiProperty({
    required: false,
    example: false,
    description: 'define if your profile can be access por non-users',
    enum: ['true', 'false'],
  })
  @IsEnum(['true', 'false'])
  @IsOptional()
  isPublic?: string;

  @ApiProperty({
    required: false,
    example: JSON.stringify({
      hair: ICategoryHair.BLACK,
      eyes: ICategoryEyes.BLUE,
      biotype: ICategoryBiotype.ATHLETIC,
      gender: ICategoryGender.F,
      ethnicity: ICategoryEthnicity.CAUCASIAN,
    }),
  })
  caracteristics?: ICaracteristicas;

  @ApiProperty({
    required: false,
    examples: ['F', 'M'],
  })
  interests?: InterestsDto;
}

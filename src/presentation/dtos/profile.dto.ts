import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  ICategory,
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

export class ProfileDto implements IProfile {
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
  @Matches(regex.vypperID, { message: 'invalida format' })
  @ApiProperty({ required: false, example: 'fulana' })
  vypperID?: string;
  @IsISO8601()
  @IsOptional()
  @ApiProperty({ required: false, example: '1991-01-01T00:00:00.000Z' })
  birthday?: string;

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

  @ApiProperty({
    required: false,
    example: '99323107000',
  })
  @IsString()
  cpf: string;
}

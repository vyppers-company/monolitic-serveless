import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { IGender, IProfile } from 'src/domain/entity/user.entity';
import regex from 'src/shared/helpers/regex';

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
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: IGender, example: IGender.F })
  gender?: IGender;
}

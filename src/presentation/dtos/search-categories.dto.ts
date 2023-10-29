import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ICategory,
  ICategoryBiotype,
  ICategoryEthnicity,
  ICategoryEyes,
  ICategoryGender,
  ICategoryHair,
} from 'src/domain/entity/category';

export class SearchCategoryDto implements ICategory {
  @IsEnum(ICategoryHair, { each: true })
  @ApiProperty({
    required: true,
    enum: ICategoryHair,
    example: [ICategoryHair.BLACK],
  })
  @IsOptional()
  hair?: ICategoryHair[];

  @IsEnum(ICategoryBiotype, { each: true })
  @ApiProperty({
    required: true,
    enum: ICategoryBiotype,
    example: [ICategoryBiotype.SLIM],
  })
  @IsOptional()
  biotype?: ICategoryBiotype[];

  @IsEnum(ICategoryEthnicity, { each: true })
  @ApiProperty({
    required: true,
    enum: ICategoryEthnicity,
    example: [ICategoryEthnicity.ASIAN],
  })
  @IsOptional()
  ethnicity?: ICategoryEthnicity[];

  @IsEnum(ICategoryEyes, { each: true })
  @ApiProperty({
    required: true,
    enum: ICategoryEyes,
    example: [ICategoryEyes.BROWN],
  })
  @IsOptional()
  eyes?: ICategoryEyes[];

  @IsEnum(ICategoryGender, { each: true })
  @ApiProperty({
    required: true,
    enum: ICategoryGender,
    example: [ICategoryGender.F],
  })
  @IsOptional()
  gender?: ICategoryGender[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: false,
    type: String,
  })
  verified: string;

  @IsNumber()
  @Transform(({ value }) => (parseFloat(value) ? parseFloat(value) : 1))
  @ApiProperty({
    required: false,
    example: 1,
    type: Number,
  })
  @IsOptional()
  page: number;

  @IsNumber()
  @Transform(({ value }) => (parseFloat(value) ? parseFloat(value) : 10))
  @ApiProperty({
    required: false,
    example: 10,
    type: Number,
  })
  @IsOptional()
  limit: number;

  @IsString()
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  value: string;
}

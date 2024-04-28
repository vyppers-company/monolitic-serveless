import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  AuthorizedTypesMidia,
  IContentEntity,
  ISingleProductOnContentDto,
  ITypeContent,
  IUploadContent,
} from 'src/domain/entity/contents';
import { Type } from 'class-transformer';

export class SingleProductOnContentDto implements ISingleProductOnContentDto {
  @ApiProperty({ example: 1000 })
  @IsNumber()
  price: number;
}
export class UploadContentDto implements IUploadContent {
  @ApiProperty()
  @IsString()
  @IsOptional()
  blockedThumb?: string;
  @IsString()
  @ApiProperty()
  @IsOptional()
  content: string;
  @IsString()
  @ApiProperty()
  @IsOptional()
  preview?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  shortContent?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  thumb?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  extension?: string;
  @ApiProperty()
  @IsString()
  type: AuthorizedTypesMidia;
}
export class CreateContentDto implements IContentEntity {
  @ApiProperty({
    examples: ['object_id_here1', 'object_id_here2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  plans?: string[] | null;

  @IsEnum(ITypeContent, {
    each: true,
    message: 'Invalid status. Please provide one of the following values',
  })
  @ApiProperty({ examples: ITypeContent })
  type: ITypeContent;

  @IsArray()
  @Type(() => UploadContentDto)
  @ApiProperty({
    example: JSON.stringify([
      {
        _id: 'string',
        extension: 'jpeg',
        type: 'IMAGE',
        content: 'string',
        thumb: 'string',
        blockedThumb: 'string',
      },
    ]),
  })
  contents?: UploadContentDto[];

  @ApiProperty({
    example: 'description_here',
    required: false,
  })
  text?: string;

  @ApiProperty({
    required: false,
    example: JSON.stringify({
      price: 100,
    }),
  })
  @IsOptional()
  product?: SingleProductOnContentDto;
}

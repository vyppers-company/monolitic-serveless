import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  AuthorizedTypesMidia,
  IContentEntity,
  ITypeContent,
  IUploadContent,
} from 'src/domain/entity/contents';
import { Type } from 'class-transformer';
export class UploadContentDto implements IUploadContent {
  @ApiProperty()
  @IsString()
  @IsOptional()
  blockedThumb?: string;
  @IsString()
  @ApiProperty()
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
  @IsString()
  extension: string;
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
  @ValidateNested({ each: true })
  @Type(() => UploadContentDto)
  @ApiProperty({
    example: JSON.stringify([
      {
        type: 'string',
        thumb: 'string',
        blockedThumb: 'string',
        content: 'string',
        preview: 'string',
        shortContent: 'string',
        group: 'string',
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
    example: 'product_id',
  })
  @IsOptional()
  productId?: string | null;
}

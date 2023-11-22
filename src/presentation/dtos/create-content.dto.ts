import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IContentEntity, ITypeContent } from 'src/domain/entity/contents';

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
  @ApiProperty({
    examples: ['https://image_url.com/image1', 'https://image_url.com/video'],
    required: false,
  })
  contents?: string[];

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

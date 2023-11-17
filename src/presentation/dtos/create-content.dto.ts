import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IContentEntity, ITypeContent } from 'src/domain/entity/contents';

export class CreateContentDto implements IContentEntity {
  @ApiProperty({ example: 'id do plano aqui', required: false })
  @IsOptional()
  @IsString()
  planId?: string;

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
}

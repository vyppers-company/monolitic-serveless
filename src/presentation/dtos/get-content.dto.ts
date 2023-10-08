import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ITypeContent } from 'src/app/domain/entities/contents';

export class TypeQueryDto {
  @IsEnum(ITypeContent, {
    each: true,
    message: 'Invalid type. Please provide one of the following values',
  })
  @ApiProperty({ examples: ITypeContent })
  type: ITypeContent;
}

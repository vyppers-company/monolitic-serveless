import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export interface IEditContentDto {
  owner: string;
  text: string;
  contentId: string;
  plans?: string[];
}

export class EditContentDto implements Pick<IEditContentDto, 'text' | 'plans'> {
  @IsString()
  @MaxLength(1024, { message: 'message is too large' })
  @ApiProperty({
    example: 'description_here',
  })
  text: string;
  @ApiProperty({
    examples: ['object_id_here1', 'object_id_here2'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  plans?: string[] | null;
}

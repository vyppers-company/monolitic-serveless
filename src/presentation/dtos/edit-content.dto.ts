import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export interface IEditContentDto {
  owner: string;
  text: string;
  contentId: string;
  planId?: string;
}

export class EditContentDto
  implements Pick<IEditContentDto, 'text' | 'planId'>
{
  @IsString()
  @MaxLength(1024, { message: 'message is too large' })
  @ApiProperty({
    example: 'description_here',
  })
  text: string;
  @IsOptional()
  @ApiProperty({
    example: 'change_plan_for_content_here',
  })
  planId: string;
}

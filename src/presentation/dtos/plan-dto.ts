import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { IPlanEntity } from 'src/domain/entity/plan';

export class PlanDto implements IPlanEntity {
  @ApiProperty({
    example: true,
    required: true,
    description: 'if you want deactivate ',
  })
  @IsBoolean()
  activate: boolean;

  @ApiProperty({
    example: 1990,
    required: true,
    description: 'in cents without points',
  })
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0, allowInfinity: false })
  price: number;
  @ApiProperty({ example: 'Basiquinha BB', required: true })
  @IsString()
  name: string;
  @ApiProperty({ examples: ['benefit one'] })
  @IsArray()
  benefits: string[];

  @IsBoolean()
  @ApiProperty({ example: true })
  isAnnual: boolean;

  @IsNumber()
  @ApiProperty({ example: 0.2 })
  @IsOptional()
  annualPercentage?: number;
}

export class EditPlanDto
  implements Pick<IPlanEntity, 'benefits' | 'name' | 'activate' | 'isAnnual'>
{
  @IsArray()
  @IsOptional()
  @ApiProperty({ examples: ['benefit one'] })
  benefits: string[];

  @ApiProperty({ example: 'Basiquinha BB', required: true })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: true,
    required: true,
    description: 'if you want deactivate ',
  })
  @IsOptional()
  @IsBoolean()
  activate: boolean;

  @IsBoolean()
  @ApiProperty({ example: true })
  @IsOptional()
  isAnnual: boolean;
}

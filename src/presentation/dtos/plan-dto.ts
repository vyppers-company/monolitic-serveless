import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
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
}

export class EditPlanDto implements Pick<IPlanEntity, 'benefits' | 'name'> {
  @IsArray()
  @ApiProperty({ examples: ['benefit one'] })
  benefits: string[];
  @ApiProperty({ example: 'Basiquinha BB', required: true })
  @IsString()
  name: string;
  @ApiProperty({
    example: false,
    required: true,
    description: 'if you want deactivate ',
  })
  @ApiProperty({
    example: true,
    required: true,
    description: 'if you want deactivate ',
  })
  @IsBoolean()
  activate: boolean;
}

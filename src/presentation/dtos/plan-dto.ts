import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { IPlanEntity } from 'src/domain/entity/payment-plan';

export class PlanDto implements IPlanEntity {
  @ApiProperty({ example: 19.9, required: true })
  @IsNumber()
  price: number;
  @IsString()
  @ApiProperty({
    example: `Meu plano básico da o direito a: 
  1- fotos sensuais
`,
    required: true,
  })
  description: string;
  @ApiProperty({ example: 'Basiquinha BB', required: true })
  @IsString()
  name: string;
}

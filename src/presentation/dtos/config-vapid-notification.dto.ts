import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { NotificationConfigInterface } from 'src/domain/interfaces/usecases/vapid-notification.interface';

export class NotificationConfigDto implements NotificationConfigInterface {
  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  dontShowAnymore?: boolean;
  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

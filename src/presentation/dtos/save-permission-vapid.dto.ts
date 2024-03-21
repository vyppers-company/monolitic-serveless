import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsObject, IsString } from 'class-validator';
import {
  IKeysPushSubscription,
  IPushSubscription,
} from 'src/domain/entity/notification.entity';

export class KeysPushSubscription implements IKeysPushSubscription {
  p256dh: string;
  auth: string;
}

export class SavePermissionVapid implements IPushSubscription {
  @IsString()
  @ApiProperty({ required: true, description: 'endpoint gerado no front' })
  endpoint: string;
  @IsDefined()
  @IsObject({ always: true })
  @ApiProperty({
    required: false,
    example: JSON.stringify({
      p256dh: 'string',
      auth: 'string',
    }),
  })
  keys: IKeysPushSubscription;
}

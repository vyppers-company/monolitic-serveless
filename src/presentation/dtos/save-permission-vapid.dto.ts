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
/* {
    "endpoint": "https://fcm.googleapis.com/fcm/send/dylLPWEJ-f0:APA91bE5qUcB1QhG9rmhvFDa68LK9_PUXwtrn6kXZ5zeZftz4lb8dcrQgOkpCx2cv4RsP4WFq-1snff9_OSBerxRmUB8KDbRXGPIyuErqbGEohHqcGoHa_Knw44-Zf7Y9RM8ZJKo3kAp",
    "expirationTime": null,
    "keys": {
        "p256dh": "BNlEPwCeZWjWxn-udG8qpjilWkmNgcuW06PGuOHEqPRSQ6Bs6lWY-UDtTbLvg-zvC8JehaIrndl-hhMar06Cd5U",
        "auth": "feACTSvejfP356mHZna-3w"
    }
} */

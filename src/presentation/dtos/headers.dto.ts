import { IsIP } from 'class-validator';

export class HeadersDto {
  @IsIP()
  'x-consumer-ip': string;
}

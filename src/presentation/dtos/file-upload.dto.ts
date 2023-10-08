import { ApiProperty } from '@nestjs/swagger';

export class CreateUpload {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file?: any;
}

import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecoveryService } from '../../domain/usecases/notification.service';
import { Code, RecoveryDto, TokenCodeResponse } from '../dtos/recovery.dto';
import { ValidateCodeService } from 'src/domain/usecases/validate-code.service';

@ApiTags('recovery')
@Controller('recovery')
export class RecoveryController {
  constructor(
    private readonly recoveryService: RecoveryService,
    private readonly validateCodeService: ValidateCodeService,
  ) {}

  @Post('v1/generate-code')
  async recoveryEmail(@Body() dto: RecoveryDto) {
    await this.recoveryService.send(dto);
  }

  @Post('v1/validate-code')
  async validateCode(@Body() dto: Code): Promise<TokenCodeResponse> {
    return await this.validateCodeService.validateCode(dto);
  }
}

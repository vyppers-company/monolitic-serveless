import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordService } from 'src/domain/usecases/change-password.service';
import { RecoveryService } from '../../domain/usecases/recovery.service';
import { ChangePasswordDto } from '../dtos/change-pass.dto';
import { Code, RecoveryDto, TokenCodeResponse } from '../dtos/recovery.dto';
import { ValidateCodeService } from 'src/domain/usecases/validate-code.service';

@ApiTags('recovery')
@Controller('recovery')
export class RecoveryController {
  private logger: Logger;
  constructor(
    private readonly recoveryService: RecoveryService,
    private readonly changePasswordService: ChangePasswordService,
    private readonly validateCodeService: ValidateCodeService,
  ) {
    this.logger = new Logger();
  }

  @Post('v1/generate-code')
  async recoveryEmail(@Body() dto: RecoveryDto) {
    await this.recoveryService.send(dto);
  }

  @Post('v1/validate-code')
  async validateCode(@Body() dto: Code): Promise<TokenCodeResponse> {
    return await this.validateCodeService.validateCode(dto);
  }

  @Post('v1/change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return await this.changePasswordService.change(dto);
  }
}

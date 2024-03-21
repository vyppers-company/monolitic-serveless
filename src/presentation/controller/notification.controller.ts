import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordService } from 'src/domain/usecases/change-password.service';
import { ChangePasswordDto } from '../dtos/change-pass.dto';
import { Code, RecoveryDto, TokenCodeResponse } from '../dtos/recovery.dto';
import { ValidateCodeService } from 'src/domain/usecases/validate-code.service';
import { RecoveryService } from 'src/domain/usecases/notification.service';

@Controller('notification')
export class NotificaionController {
  constructor(
    private readonly recoveryService: RecoveryService,
    private readonly changePasswordService: ChangePasswordService,
    private readonly validateCodeService: ValidateCodeService,
  ) {}

  @ApiTags('notification')
  @Post('v1/code/send/recovery')
  async recoveryCode(@Body() dto: RecoveryDto) {
    return await this.recoveryService.send(dto);
  }
  @ApiTags('notification')
  @Post('v1/code/send/register')
  async registerCode(@Body() dto: RecoveryDto) {
    return await this.recoveryService.sendNaoLogado(dto);
  }

  @ApiTags('validation')
  @Post('v1/validate-code')
  async validateCode(@Body() dto: Code): Promise<TokenCodeResponse> {
    return await this.validateCodeService.validateCode(dto);
  }
  @ApiTags('recovery')
  @Post('v1/change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return await this.changePasswordService.change(dto);
  }
}

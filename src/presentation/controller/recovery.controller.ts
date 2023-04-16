import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordService } from 'src/domain/usecases/change-password.service';
import { RecoveryService } from '../../domain/usecases/recovery.service';
import { ChangePasswordDto } from '../dtos/change-pass.dto';
import { RecoveryDto } from '../dtos/recovery.dto';

@ApiTags('recovery')
@Controller('recovery')
export class RecoveryController {
  private logger: Logger;
  constructor(
    private readonly recoveryService: RecoveryService,
    private readonly changePasswordService: ChangePasswordService,
  ) {
    this.logger = new Logger();
  }

  @Post('v1/generate-code')
  async recoveryEmail(@Body() dto: RecoveryDto) {
    await this.recoveryService.send(dto);
  }

  @Post('v1/change-password')
  async changePassword(@Body() dto: ChangePasswordDto) {
    return await this.changePasswordService.change(dto);
  }
}

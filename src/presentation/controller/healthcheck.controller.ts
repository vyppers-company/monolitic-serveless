import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('healthcheck')
@Controller('/healthcheck')
export class HealthcheckController {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(HealthcheckController.name);
  }

  @Get()
  async selectExam() {
    return 'this services is online v 1.0.0';
  }
}

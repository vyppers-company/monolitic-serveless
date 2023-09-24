import { Controller, Logger, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { UserService } from 'src/domain/usecases/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  private logger: Logger;
  constructor(private readonly userService: UserService) {
    this.logger = new Logger();
  }

  @Get('v1/profile')
  async auth(@Logged() logged: ILogged) {
    return await this.userService.getPersonalData(logged);
  }
}

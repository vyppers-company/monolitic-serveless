import { Controller, Logger, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { UserService } from 'src/domain/usecases/user.service';
import { Role } from 'src/domain/interfaces/others/role.interface';

@ApiTags('user')
@Controller('user')
export class UserController {
  private logger: Logger;
  constructor(private readonly userService: UserService) {
    this.logger = new Logger();
  }

  @Get('v1/personal-data')
  async auth(@Logged() logged: ILogged) {
    if (logged.role !== Role.CUSTOMERS) {
      return await this.userService.getPersonalData(logged);
    }
  }
}

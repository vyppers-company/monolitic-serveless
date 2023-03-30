import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Role } from '../../domain/interfaces/others/role.interface';
import { ILogged } from '../../domain/interfaces/others/logged.interface';

import { RegisterDto } from '../dtos/register.dto';
import { RegisterService } from '../../domain/usecases/register.service';
import { Logged } from '../../shared/decorators/logged.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@ApiTags('register')
@Controller('register')
export class RegisterController {
  private logger: Logger;
  constructor(private readonly registerService: RegisterService) {
    this.logger = new Logger();
  }

  @Post('v1/customer')
  @ApiBody({ type: RegisterDto })
  async customer(@Body() dto: RegisterDto) {
    if (dto.role !== Role.CUSTOMERS) {
      throw new UnauthorizedException();
    }
    return await this.registerService.register(dto);
  }

  @ApiBearerAuth()
  @Post('v1/employee')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: RegisterDto })
  async employees(@Body() dto: RegisterDto, @Logged() logged: ILogged) {
    if (dto.role !== Role.EMPLOYES || logged.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }
    return await this.registerService.register(dto);
  }

  @ApiBearerAuth()
  @Post('v1/admin')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: RegisterDto })
  async internals(@Body() dto: RegisterDto, @Logged() logged: ILogged) {
    if (dto.role !== Role.ADMIN || logged.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }
    return await this.registerService.register(dto);
  }
}

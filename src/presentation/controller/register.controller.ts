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
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { InternalsRole } from '../../shared/guards/role.guard';

import { RegisterDto } from '../dtos/register.dto';
import { RegisterService } from '../../domain/usecases/register.service';

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
      throw new UnauthorizedException('não autorizado');
    }
    return await this.registerService.register(dto);
  }

  @Post('v1/professional')
  @ApiBody({ type: RegisterDto })
  async professional(@Body() dto: RegisterDto) {
    if (dto.role !== Role.PROFESSIONAL) {
      throw new UnauthorizedException('não autorizado');
    }
    return await this.registerService.register(dto);
  }

  @ApiBearerAuth()
  @Post('v1/employee')
  @UseGuards(JwtAuthGuard)
  @UseGuards(InternalsRole)
  @ApiBody({ type: RegisterDto })
  async employees(@Body() dto: RegisterDto) {
    if (dto.role !== Role.EMPLOYES) {
      throw new UnauthorizedException('não autorizado');
    }
    return await this.registerService.register(dto);
  }

  @ApiBearerAuth()
  @Post('v1/admin')
  @UseGuards(JwtAuthGuard)
  @UseGuards(InternalsRole)
  @ApiBody({ type: RegisterDto })
  async internals(@Body() dto: RegisterDto) {
    if (dto.role !== Role.ADMIN) {
      throw new UnauthorizedException('não autorizado');
    }
    return await this.registerService.register(dto);
  }
}

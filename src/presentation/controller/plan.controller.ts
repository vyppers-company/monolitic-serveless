import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { PlanService } from 'src/domain/usecases/plan.service';
import { Logged } from 'src/shared/decorators/logged.decorator';
import { EditPlanDto, PlanDto } from '../dtos/plan-dto';

@ApiTags('plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('v1/create')
  @ApiBearerAuth()
  @ApiBody({ type: PlanDto })
  async createPlan(@Logged() user: ILogged, @Body() dto: PlanDto) {
    return await this.planService.createPlan(user._id, dto);
  }

  @Put('v1/update/:planId')
  @ApiBearerAuth()
  @ApiBody({ type: EditPlanDto })
  async updatePlan(
    @Logged() user: ILogged,
    @Body() dto: EditPlanDto,
    @Param('planId') planId: string,
  ) {
    return await this.planService.editPlan(planId, user._id, dto);
  }

  @Get('v1/all')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'userId',
    required: false,
    example:
      'id do usuario que deseja buscar, se nao passar vai ser utilizado o do token',
  })
  async getAll(
    @Logged() user: ILogged,
    @Query('userId') userId: string,
    @Query('resumed') resumed: boolean,
  ) {
    return await this.planService.getPlans(
      userId === user._id ? true : false,
      user._id,
      userId || user._id,
      resumed,
    );
  }

  @Get('v1/unique/:planId')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'userId',
    required: false,
    example:
      'id do usuario que deseja buscar, se nao passar será utilizado o do token',
  })
  async getOne(
    @Logged() user: ILogged,
    @Param('planId') planId: string,
    @Query('userId') userId: string,
  ) {
    return await this.planService.getPlan(
      userId === user._id ? true : false,
      planId,
      userId || user._id,
    );
  }

  @Delete('v1/delete/:planId')
  @ApiBearerAuth()
  async deletePlan(@Logged() user: ILogged, @Param('planId') planId: string) {
    return await this.planService.deletePlan(user._id, planId);
  }
}

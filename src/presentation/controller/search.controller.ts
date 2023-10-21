import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchUsersService } from 'src/domain/usecases/search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  private logger: Logger;
  constructor(private readonly searchService: SearchUsersService) {
    this.logger = new Logger(SearchController.name);
  }

  @Get('v1/users')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'quantidade que deseja buscar. valor padrao 10',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'numero da pagina que deseja buscar. valo padrao 1',
  })
  @ApiQuery({
    name: 'value',
    required: false,
    description: 'valor da busca por nome ou arroba',
  })
  async selectExam(
    @Query('value') value: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.searchService.searchUser(value, limit || 10, page || 1);
  }
}

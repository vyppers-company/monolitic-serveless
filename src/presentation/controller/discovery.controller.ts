import { Controller, Get, Logger, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SearchUsersService } from 'src/domain/usecases/search.service';
import {
  SearchCategoryDto,
  SearchQueriesCompleteDto,
} from '../dtos/search-categories.dto';
import {
  ICategoryBiotype,
  ICategoryEthnicity,
  ICategoryEyes,
  ICategoryGender,
  ICategoryHair,
} from 'src/domain/entity/category';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { Logged } from 'src/shared/decorators/logged.decorator';

@ApiTags('discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly searchService: SearchUsersService) {}

  @Get('v1/contents-by-user')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'quantidade que deseja buscar. valor padrao 10',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'numero da pagina que deseja buscar. valo padrao 1',
  })
  @ApiQuery({
    name: 'value',
    required: false,
    type: String,
    description: 'valor da busca por nome ou vypperId',
  })
  @ApiQuery({
    name: 'verified',
    required: false,
    description: 'busca por perfis verificados',
    type: Boolean,
  })
  @ApiQuery({
    name: 'hair',
    type: Array,
    required: false,
    description: 'busca por cor dos cabelos',
    enum: ICategoryHair,
  })
  @ApiQuery({
    name: 'eyes',
    type: Array,
    required: false,
    description: 'busca por cor dos olhos',
    enum: ICategoryEyes,
  })
  @ApiQuery({
    name: 'biotype',
    type: Array,
    required: false,
    description: 'busca por biotipo corporal',
    enum: ICategoryBiotype,
  })
  @ApiQuery({
    name: 'gender',
    type: Array,
    required: false,
    description: 'busca por genero',
    enum: ICategoryGender,
  })
  @ApiQuery({
    name: 'ethnicity',
    required: false,
    type: Array,
    description: 'busca por etnia',
    enum: ICategoryEthnicity,
  })
  async searchUserV2(
    @Query() queries: SearchQueriesCompleteDto,
    @Logged() user: ILogged,
  ) {
    return this.searchService.searchUserV2(queries, user._id);
  }

  @Get('v1/contents-by-user/opened')
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'quantidade que deseja buscar. valor padrao 10',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'numero da pagina que deseja buscar. valo padrao 1',
  })
  async searchUserOpened(
    @Query() queries: Pick<SearchQueriesCompleteDto, 'limit' | 'page'>,
  ) {
    return 'falta implementar';
  }

  @Get('v1/consult/filter')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retorna todas as possibilidades de filtro',
  })
  async getCategories(@Logged() user: ILogged) {
    return {
      biotype: ICategoryBiotype,
      ethnicity: ICategoryEthnicity,
      eyes: ICategoryEyes,
      gender: ICategoryGender,
      hair: ICategoryHair,
      verified: [true, false],
    };
  }
}

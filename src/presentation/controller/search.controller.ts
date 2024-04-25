import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SearchUsersService } from 'src/domain/usecases/search.service';
import { SearchQueriesCompleteDto } from '../dtos/search-categories.dto';
import {
  ICategoryBiotype,
  ICategoryEthnicity,
  ICategoryEyes,
  ICategoryGender,
  ICategoryHair,
} from 'src/domain/entity/category';
import { ILogged } from 'src/domain/interfaces/others/logged.interface';
import { Logged } from 'src/shared/decorators/logged.decorator';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchUsersService) {}

  @Get('v1/users')
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
  async searchUser(
    @Query() queries: SearchQueriesCompleteDto,
    @Logged() user: ILogged,
  ) {
    return this.searchService.searchUser(queries, user._id);
  }

  @Get('v1/users/type')
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
    name: 'type',
    required: false,
    type: String,
    description: 'tipo de filtro',
    enum: ['NEWS', 'MOST_FOLLOWED', 'IGNORE'],
  })
  @ApiQuery({
    name: 'isfollowed',
    required: false,
    type: String,
    description: 'se eu sigo ou nao a pessoa',
    enum: ['true', 'false', 'ignore'],
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'se eu sigo ou nao a pessoa',
    enum: ['from_recent', 'from_older', 'ignore'],
  })
  @ApiQuery({
    name: 'isverified',
    required: false,
    type: String,
    description: 'se verificado ou nao',
    enum: ['true', 'false', 'ignore'],
  })
  async searchUserByTyper(
    @Logged() user: ILogged,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('type') type?: string,
    @Query('isfollowed') isFollowed?: string,
    @Query('sort') sort?: string,
    @Query('isverified') isVerified?: string,
  ) {
    return this.searchService.searchUserByCriteria(
      user._id,
      limit || 10,
      page || 1,
      type || 'IGNORE',
      isFollowed || 'ignore',
      sort || 'ignore',
      isVerified || 'ignore',
    );
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

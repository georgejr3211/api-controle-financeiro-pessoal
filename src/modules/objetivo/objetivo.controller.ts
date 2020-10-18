import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { Objetivo } from '../../entities/objetivo.entity';
import { QueryDto } from './../../dtos/query.dto';
import { ObjetivoService } from './objetivo.service';

@Crud({
  model: {
    type: Objetivo,
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
    join: {
      pessoa: { eager: true },
      tipoObjetivo: { eager: true },
      instituicaoFinanceira: { eager: true },
    },
  },
})
@ApiTags('Objetivo')
@Controller('objetivos')
export class ObjetivoController {
  constructor(public readonly service: ObjetivoService) { }

  @Get()
  getAllObjetivosByPessoa(@Query() query: QueryDto) {
    console.log(query);
    return this.service.getAllObjetivosByPessoa(query);
  }

}

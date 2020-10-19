import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { MENSAGENS } from 'src/common/enums/mensagens';
import { Result } from 'src/common/interfaces/response';

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
  async getAllObjetivosByPessoa(@Query() query: QueryDto) {
    const result = await this.service.getAllObjetivosByPessoa(query);
    return new Result({ data: result, error: null, total: result.length, message: MENSAGENS.SUCESSO });
  }

}

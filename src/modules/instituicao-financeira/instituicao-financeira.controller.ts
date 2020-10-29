import { InstituicaoFinanceira } from '../../entities/instituicao-financeira.entity';
import { Controller } from '@nestjs/common';
import { InstituicaoFinanceiraService } from './instituicao-financeira.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: InstituicaoFinanceira,
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
    join: {
      pessoa: { eager: true },
      categorias: { eager: true },
    },
  },
})
@ApiTags('InstituicaoFinanceira')
@Controller('instituicoes-financeiras')
export class InstituicaoFinanceiraController {
  constructor(private readonly service: InstituicaoFinanceiraService) { }

}

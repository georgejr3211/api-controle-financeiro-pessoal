import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';

import { TipoMovimentacao } from '../../entities/tipo-movimentacao.entity';
import { TipoMovimentacaoService } from './tipo-movimentacao.service';

@Crud({
  model: {
    type: TipoMovimentacao,
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
  },
})
@Controller('tipos-movimentacao')
export class TipoMovimentacaoController {
  constructor(private readonly service: TipoMovimentacaoService) { }

}

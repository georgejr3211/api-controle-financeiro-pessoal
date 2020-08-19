import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';

import { TipoMovimentacao } from '../../entities/tipo-movimentacao.entity';
import { TipoMovimentacaoService } from './tipo-movimentacao.service';
import { ApiTags } from '@nestjs/swagger';

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
@ApiTags('Tipo de movimentação')
@Controller('tipos-movimentacao')
export class TipoMovimentacaoController {
  constructor(private readonly service: TipoMovimentacaoService) { }

}

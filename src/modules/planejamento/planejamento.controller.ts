import { Planejamento } from '../../entities/planejamento.entity';
import { Controller } from '@nestjs/common';
import { PlanejamentoService } from './planejamento.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Planejamento,
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
    join: {
      pessoa: { eager: true }
    },
  },
})
@ApiTags('Planejamento')
@Controller('planejamentos')
export class PlanejamentoController {
  constructor(private readonly service: PlanejamentoService) { }

}

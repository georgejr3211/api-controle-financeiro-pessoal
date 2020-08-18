import { Parcela } from './../../entities/parcela.entity';
import { Controller } from '@nestjs/common';
import { ParcelaService } from './parcela.service';
import { Crud } from '@nestjsx/crud';

@Crud({
  model: {
    type: Parcela,
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
  },
})
@Controller('parcelas')
export class ParcelaController {
  constructor(public readonly service: ParcelaService) { }

}

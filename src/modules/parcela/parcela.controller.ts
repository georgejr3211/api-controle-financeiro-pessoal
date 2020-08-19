import { Parcela } from './../../entities/parcela.entity';
import { Controller } from '@nestjs/common';
import { ParcelaService } from './parcela.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';

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
@ApiTags('Parcela')
@Controller('parcelas')
export class ParcelaController {
  constructor(public readonly service: ParcelaService) { }

}

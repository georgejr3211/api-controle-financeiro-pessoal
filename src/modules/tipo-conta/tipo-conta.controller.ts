import { TipoConta } from '../../entities/tipo-conta.entity';
import { Controller } from '@nestjs/common';
import { TipoContaService } from './tipo-conta.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: TipoConta,
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
@ApiTags('TipoConta')
@Controller('tipo-contas')
export class TipoContaController {
  constructor(private readonly service: TipoContaService) { }

}

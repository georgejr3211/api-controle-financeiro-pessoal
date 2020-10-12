import { Conta } from '../../entities/conta.entity';
import { Controller } from '@nestjs/common';
import { ContaService } from './conta.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Conta,
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
    join: {
      pessoa: { eager: true },
      tipoConta: { eager: true },
      instituicaoFinanceira: { eager: true },
    },
  },
})
@ApiTags('Conta')
@Controller('contas')
export class ContaController {
  constructor(private readonly service: ContaService) { }

}

import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Pessoa } from '../../entities/pessoa.entity';

import { PessoaService } from './pessoa.service';

@Crud({
  model: {
    type: Pessoa,
  },
  query: {
    join: {
      usuario: { eager: true },
    },
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
  },
})
@Controller('pessoas')
export class PessoaController {
  constructor(private readonly service: PessoaService) { }
}

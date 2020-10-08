import { Tarefa } from '../../entities/tarefa.entity';
import { Controller } from '@nestjs/common';
import { TarefaService } from './tarefa.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Tarefa,
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
    join: {
      pessoa: { eager: true }
    }
  },
})
@ApiTags('Tarefa')
@Controller('tarefas')
export class TarefaController {
  constructor(private readonly service: TarefaService) { }

}

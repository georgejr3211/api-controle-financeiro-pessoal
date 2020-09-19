import { Categoria } from './../../entities/categoria.entity';
import { Controller } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Crud } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Categoria,
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
@ApiTags('Categoria')
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly service: CategoriaService) { }

}

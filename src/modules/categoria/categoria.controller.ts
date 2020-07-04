import { Categoria } from './../../entities/categoria.entity';
import { Controller } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Crud } from '@nestjsx/crud';

@Crud({
  model: {
    type: Categoria,
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
  },
})
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly service: CategoriaService) { }

}

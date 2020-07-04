import { Categoria } from './../../entities/categoria.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriaService extends TypeOrmCrudService<Categoria> {
  constructor(@InjectRepository(Categoria) repo) {
    super(repo);
  }
}

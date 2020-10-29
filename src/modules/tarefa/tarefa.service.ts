import { Tarefa } from '../../entities/tarefa.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TarefaService extends TypeOrmCrudService<Tarefa> {
  constructor(@InjectRepository(Tarefa) repo) {
    super(repo);
  }
}

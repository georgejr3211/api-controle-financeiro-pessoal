import { Planejamento } from '../../entities/planejamento.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlanejamentoService extends TypeOrmCrudService<Planejamento> {
  constructor(@InjectRepository(Planejamento) repo) {
    super(repo);
  }
}

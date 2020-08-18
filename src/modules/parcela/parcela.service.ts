import { Parcela } from './../../entities/parcela.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ParcelaService extends TypeOrmCrudService<Parcela> {
  constructor(@InjectRepository(Parcela) repo) {
    super(repo);
  }
}

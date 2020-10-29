import { TipoConta } from '../../entities/tipo-conta.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TipoContaService extends TypeOrmCrudService<TipoConta> {
  constructor(@InjectRepository(TipoConta) repo) {
    super(repo);
  }
}

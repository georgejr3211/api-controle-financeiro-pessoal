import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Pessoa } from '../../entities/pessoa.entity';

@Injectable()
export class PessoaService extends TypeOrmCrudService<Pessoa> {
  constructor(@InjectRepository(Pessoa) repo) {
    super(repo);
  }
}

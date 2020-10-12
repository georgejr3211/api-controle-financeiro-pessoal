import { InstituicaoFinanceira } from '../../entities/instituicao-financeira.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InstituicaoFinanceiraService extends TypeOrmCrudService<InstituicaoFinanceira> {
  constructor(@InjectRepository(InstituicaoFinanceira) repo) {
    super(repo);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { TipoMovimentacao } from '../../entities/tipo-movimentacao.entity';

@Injectable()
export class TipoMovimentacaoService extends TypeOrmCrudService<TipoMovimentacao> {
  constructor(@InjectRepository(TipoMovimentacao) repo) {
    super(repo);
  }
}

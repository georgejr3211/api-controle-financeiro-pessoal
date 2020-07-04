import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Movimentacao } from '../../entities/movimentacao.entity';

@Injectable()
export class MovimentacaoService extends TypeOrmCrudService<Movimentacao> {
  constructor(
    @InjectRepository(Movimentacao) repo,
  ) {
    super(repo);
  }

  async getSaldo(pessoaId: number, dtPeriodo: string) {
    const sql = `
    (
      SELECT SUM(total) AS total
      FROM movimentacoes m2
      WHERE id_pessoa = ${pessoaId}
      AND pago = 1
      AND id_tipo_movimentacao = 1
      AND TO_CHAR(dt_lancamento, 'YYYY-MM') LIKE '${dtPeriodo}'
    ) -
    (
      SELECT SUM(total) AS total
      FROM movimentacoes m2
      WHERE id_pessoa = ${pessoaId}
      AND pago = 1
      AND id_tipo_movimentacao = 2
      AND TO_CHAR(dt_lancamento, 'YYYY-MM') LIKE '${dtPeriodo}'
    )
  AS total`;

    const result = await this.repo.createQueryBuilder()
      .select(sql)
      .getRawOne();

    return result;
  }

  async getSaldoByTipoMovimentacao(pessoaId: number, idTipoMovimentacao: number, dtPeriodo: string) {
    const result = await this.repo.createQueryBuilder('movimentacao')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .where('movimentacao.pago = 1')
      .andWhere(`TO_CHAR(movimentacao.dtLancamento, 'YYYY-MM') LIKE :dtPeriodo`, { dtPeriodo })
      .andWhere(`tipoMovimentacao.id = :idTipoMovimentacao`, { idTipoMovimentacao: Number(idTipoMovimentacao) })
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .select('SUM(movimentacao.total) as total')
      .groupBy('tipoMovimentacao.id')
      .getRawOne();

    if (!result) {
      return { total: '0.00' };
    }

    return result;
  }

  async getDespesasGroupByCategoria(pessoaId: number, dtPeriodo: string) {
    const result = await this.repo.createQueryBuilder('movimentacao')
      .select([
        'categoria.descricao as descricao',
        'SUM(movimentacao.total) as total',
      ])
      .innerJoin('movimentacao.categoria', 'categoria')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .where('tipoMovimentacao.id = 2')
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .andWhere(`TO_CHAR(movimentacao.dtLancamento, 'YYYY-MM') LIKE :dtPeriodo`, { dtPeriodo })
      .groupBy('categoria.id')
      .orderBy('total', 'DESC')
      .getRawMany();

    return result;
  }

  async getMovimentacoesPendentes(pessoaId: number, dtPeriodo: string, tipoMovimentacaoId: number) {
    const result = await this.repo.createQueryBuilder('movimentacao')
      .innerJoinAndSelect('movimentacao.categoria', 'categoria')
      .innerJoinAndSelect('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .where('tipoMovimentacao.id = :tipoMovimentacaoId', { tipoMovimentacaoId })
      .andWhere('movimentacao.pago = 0')
      .andWhere(`TO_CHAR(movimentacao.dtLancamento, 'YYYY-MM') LIKE :dtPeriodo`, { dtPeriodo })
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .orderBy('movimentacao.dtLancamento', 'ASC')
      .limit(5)
      .getManyAndCount();

    return result;
  }
}

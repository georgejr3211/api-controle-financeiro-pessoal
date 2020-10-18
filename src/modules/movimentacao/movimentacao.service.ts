import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as moment from 'moment-timezone';

import { groupBy } from '../../common/utils/array';
import { Movimentacao } from '../../entities/movimentacao.entity';
import { MENSAGENS } from './../../common/enums/mensagens';

@Injectable()
export class MovimentacaoService extends TypeOrmCrudService<Movimentacao> {
  constructor(@InjectRepository(Movimentacao) repo) {
    super(repo);
  }

  async getSaldo(pessoaId: number, dtPeriodo: string | string[]) {
    const hasPeriodo = dtPeriodo ?
      Array.isArray(dtPeriodo)
        ? `AND TO_CHAR(m2.dt_conta, 'YYYY-MM') BETWEEN '${dtPeriodo[0]}' AND '${dtPeriodo[1]}'`
        : `AND TO_CHAR(m2.dt_conta, 'YYYY-MM') LIKE '${dtPeriodo}'`
      : ``;

    const sql = `
    (
      SELECT SUM(m2.total) AS total
      FROM movimentacoes m2
      INNER JOIN contas c ON c.id_conta = m2.id_conta
      WHERE m2.id_pessoa = ${pessoaId}
      AND concluido = 1
      AND id_tipo_movimentacao = 1
      AND m2.status = 1
      AND c.incluir_soma = 1
      ${hasPeriodo}
    ) -
    (
      SELECT SUM(m2.total) AS total
      FROM movimentacoes m2
      INNER JOIN contas c ON c.id_conta = m2.id_conta
      WHERE m2.id_pessoa = ${pessoaId}
      AND concluido = 1
      AND id_tipo_movimentacao = 2
      AND m2.status = 1
      AND c.incluir_soma = 1
      ${hasPeriodo}
    )
  AS total`;

    const result = await this.repo
      .createQueryBuilder()
      .select(sql)
      .getRawOne();

    return result && 'total' in result && result.total ? result : { total: '0.00' };
  }

  async getSaldoFuturo(pessoaId: number, dtPeriodo: string | string[]) {
    const hasPeriodo = dtPeriodo ?
      Array.isArray(dtPeriodo)
        ? `AND TO_CHAR(m2.dt_conta, 'YYYY-MM') BETWEEN '${dtPeriodo[0]}' AND '${dtPeriodo[1]}'`
        : `AND TO_CHAR(m2.dt_conta, 'YYYY-MM') LIKE '${dtPeriodo}'`
      : ``;

    const sql = `
  (
    SELECT SUM(m2.total) AS total
    FROM movimentacoes m2
    INNER JOIN contas c ON c.id_conta = m2.id_conta
    WHERE m2.id_pessoa = ${pessoaId}
    AND id_tipo_movimentacao = 1
    AND m2.status = 1
    AND c.incluir_soma = 1
    ${hasPeriodo}
  ) -
  (
    SELECT SUM(m2.total) AS total
    FROM movimentacoes m2
    INNER JOIN contas c ON c.id_conta = m2.id_conta
    WHERE m2.id_pessoa = ${pessoaId}
    AND id_tipo_movimentacao = 2
    AND m2.status = 1
    AND c.incluir_soma = 1
    ${hasPeriodo}
  )
  AS total`;

    const result = await this.repo
      .createQueryBuilder()
      .select(sql)
      .getRawOne();

    return 'total' in result && result.total ? result : { total: '0.00' };
  }

  async getSaldoByTipoMovimentacao(
    pessoaId: number,
    idTipoMovimentacao: number,
    dtPeriodo: string | string[],
  ) {
    const qb = this.repo
      .createQueryBuilder('movimentacao')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .innerJoin('movimentacao.conta', 'conta')
      .where('movimentacao.concluido = 1')
      .andWhere(`tipoMovimentacao.id = :idTipoMovimentacao`, {
        idTipoMovimentacao: Number(idTipoMovimentacao),
      })
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .andWhere('movimentacao.status = 1')
      .andWhere('conta.incluirSoma = 1')
      .select('SUM(movimentacao.total) as total')
      .groupBy('tipoMovimentacao.id');

    if (dtPeriodo) {
      if (Array.isArray(dtPeriodo)) {
        qb.andWhere(`TO_CHAR(movimentacao.dtConta, 'YYYY-MM') BETWEEN :dtPeriodoIni AND :dtPeriodoFin`,
          { dtPeriodoIni: dtPeriodo[0], dtPeriodoFin: dtPeriodo[1] });
      } else {
        qb.andWhere(
          `TO_CHAR(movimentacao.dtConta, 'YYYY-MM') LIKE :dtPeriodo`,
          { dtPeriodo },
        );
      }
    }

    const result = await qb.getRawOne();

    if (!result) {
      return { total: '0.00' };
    }

    return result;
  }

  async getCountContasByTipoMovimentacaoAndNaoConcluida(
    pessoaId: number,
    idTipoMovimentacao: number,
    dtPeriodo: string | string[],
  ) {
    const qb = this.repo
      .createQueryBuilder('movimentacao')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .innerJoin('movimentacao.conta', 'conta')
      .where('movimentacao.concluido = 0')
      .andWhere(`tipoMovimentacao.id = :idTipoMovimentacao`, {
        idTipoMovimentacao: Number(idTipoMovimentacao),
      })
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .andWhere('movimentacao.status = 1')
      .andWhere('conta.incluirSoma = 1')
      .select('COUNT(movimentacao.id) as total')
      .groupBy('tipoMovimentacao.id');

    if (dtPeriodo) {
      if (Array.isArray(dtPeriodo)) {
        qb.andWhere(`TO_CHAR(movimentacao.dtConta, 'YYYY-MM') BETWEEN :dtPeriodoIni AND :dtPeriodoFin`,
          { dtPeriodoIni: dtPeriodo[0], dtPeriodoFin: dtPeriodo[1] });
      } else {
        qb.andWhere(
          `TO_CHAR(movimentacao.dtConta, 'YYYY-MM') LIKE :dtPeriodo`,
          { dtPeriodo },
        );
      }
    }

    const result = await qb.getRawOne();

    if (!result) {
      return { total: '0' };
    }

    return result;
  }

  async getCountContasAtrasadas(
    pessoaId: number,
    dtPeriodo: string | string[],
  ) {
    const dtHoje = moment
      .tz(new Date(), process.env.TIMEZONE)
      .format('YYYY-MM-DD');

    const qb = this.repo
      .createQueryBuilder('movimentacao')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .innerJoin('movimentacao.conta', 'conta')
      .where('movimentacao.concluido = 0')
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .andWhere(`:dtHoje > TO_CHAR(movimentacao.dtConta, 'YYYY-MM-DD')`, { dtHoje })
      .andWhere('movimentacao.status = 1')
      .andWhere('conta.incluirSoma = 1')
      .select('COUNT(movimentacao.id) as total')
      .groupBy('tipoMovimentacao.id');

    if (dtPeriodo) {
      if (Array.isArray(dtPeriodo)) {
        qb.andWhere(`TO_CHAR(movimentacao.dtConta, 'YYYY-MM') BETWEEN :dtPeriodoIni AND :dtPeriodoFin`,
          { dtPeriodoIni: dtPeriodo[0], dtPeriodoFin: dtPeriodo[1] });
      } else {
        qb.andWhere(
          `TO_CHAR(movimentacao.dtConta, 'YYYY-MM') LIKE :dtPeriodo`,
          { dtPeriodo },
        );
      }
    }

    const result = await qb.getRawOne();

    if (!result) {
      return { total: '0' };
    }

    return result;
  }

  async getDespesasGroupByCategoria(pessoaId: number, dtPeriodo: string | string[]) {
    const qb = this.repo
      .createQueryBuilder('movimentacao')
      .select([
        'categoria.descricao as name',
        'SUM(movimentacao.total) as value',
        'categoria.limite as limite',
      ])
      .innerJoin('movimentacao.categoria', 'categoria')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .innerJoin('movimentacao.conta', 'conta')
      .where('tipoMovimentacao.id = 2')
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .andWhere('categoria.status = 1')
      .andWhere('movimentacao.status = 1')
      .andWhere('movimentacao.concluido = 1')
      .andWhere('conta.incluirSoma = 1')
      .groupBy('categoria.id')
      .orderBy('value', 'DESC');

    if (dtPeriodo) {
      if (Array.isArray(dtPeriodo)) {
        qb.andWhere(`TO_CHAR(movimentacao.dtConta, 'YYYY-MM') BETWEEN :dtPeriodoIni AND :dtPeriodoFin`,
          { dtPeriodoIni: dtPeriodo[0], dtPeriodoFin: dtPeriodo[1] });
      } else {
        qb.andWhere(
          `TO_CHAR(movimentacao.dtConta, 'YYYY-MM') LIKE :dtPeriodo`,
          { dtPeriodo },
        );
      }
    }

    const result = await qb.getRawMany();

    return result;
  }

  async getTotalByCategoria(categoriaId: number, pessoaId: number, dtPeriodo: string | string[]) {
    const qb = this.repo.createQueryBuilder('movimentacao')
      .innerJoin('movimentacao.conta', 'conta')
      .select('COALESCE(SUM(movimentacao.total), 0.00)::decimal AS total')
      .where('movimentacao.categoria.id = :categoriaId', { categoriaId })
      .andWhere('movimentacao.pessoa.id = :pessoaId', { pessoaId })
      .andWhere('conta.incluirSoma = 1');

    if (dtPeriodo) {
      if (Array.isArray(dtPeriodo)) {
        qb.andWhere(`TO_CHAR(movimentacao.dtConta, 'YYYY-MM') BETWEEN :dtPeriodoIni AND :dtPeriodoFin`,
          { dtPeriodoIni: dtPeriodo[0], dtPeriodoFin: dtPeriodo[1] });
      } else {
        qb.andWhere(
          `TO_CHAR(movimentacao.dtConta, 'YYYY-MM') LIKE :dtPeriodo`,
          { dtPeriodo },
        );
      }
    }

    const result = await qb.getRawOne();

    return result;
  }

  async getMovimentacoesGroupByTipoMovimentacao(pessoaId: number, dtPeriodo: string | string[]) {
    const qb = this.repo
      .createQueryBuilder('movimentacao')
      .select([
        'tipoMovimentacao.id as id',
        'tipoMovimentacao.descricao as descricao',
        `TO_CHAR(movimentacao.dtConta, 'YYYY-MM-DD') as name`,
        // 'SUM(movimentacao.total) as value',
        `CASE
          WHEN tipoMovimentacao.id = 1 THEN SUM(movimentacao.total) ELSE 0
        END AS total_receita`,
        `CASE
          WHEN tipoMovimentacao.id = 2 THEN SUM(movimentacao.total) ELSE 0
        END AS total_despesa`,
      ])
      .innerJoin('movimentacao.categoria', 'categoria')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .innerJoin('movimentacao.conta', 'conta')
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .andWhere('movimentacao.status = 1')
      .andWhere('movimentacao.concluido = 1')
      .andWhere('conta.incluirSoma = 1')
      .groupBy('movimentacao.dtConta')
      .addGroupBy('tipoMovimentacao.id');

    if (dtPeriodo) {
      if (Array.isArray(dtPeriodo)) {
        qb.andWhere(`TO_CHAR(movimentacao.dtConta, 'YYYY-MM') BETWEEN :dtPeriodoIni AND :dtPeriodoFin`,
          { dtPeriodoIni: dtPeriodo[0], dtPeriodoFin: dtPeriodo[1] });
      } else {
        qb.andWhere(
          `TO_CHAR(movimentacao.dtConta, 'YYYY-MM') LIKE :dtPeriodo`,
          { dtPeriodo },
        );
      }
    }

    let result = await qb.getRawMany();

    result = groupBy(result, 'descricao', true);

    return result;
  }

  async getMovimentacoesPendentes(
    pessoaId: number,
    dtPeriodo: string | string[],
    tipoMovimentacaoId: number,
  ) {
    const qb = this.repo
      .createQueryBuilder('movimentacao')
      .innerJoinAndSelect('movimentacao.categoria', 'categoria')
      .innerJoinAndSelect('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .innerJoin('movimentacao.conta', 'conta')
      .where('tipoMovimentacao.id = :tipoMovimentacaoId', {
        tipoMovimentacaoId,
      })
      .andWhere('movimentacao.concluido = 0')
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .andWhere('movimentacao.status = 1')
      .andWhere('conta.incluirSoma = 1')
      .orderBy('movimentacao.dtConta', 'ASC')
      .limit(5);

    if (dtPeriodo) {
      if (Array.isArray(dtPeriodo)) {
        qb.andWhere(`TO_CHAR(movimentacao.dtConta, 'YYYY-MM') BETWEEN :dtPeriodoIni AND :dtPeriodoFin`,
          { dtPeriodoIni: dtPeriodo[0], dtPeriodoFin: dtPeriodo[1] });
      } else {
        qb.andWhere(
          `TO_CHAR(movimentacao.dtConta, 'YYYY-MM') LIKE :dtPeriodo`,
          { dtPeriodo },
        );
      }
    }

    const result = await qb.getManyAndCount();

    return result;
  }

  /**
   * @author George Alexandre
   * @description Retorna o total de contas que possuem lembretes marcados para o dia de hoje e
   * o atributo concluido seja igual a zero
   */
  async getCountContasLembretesHoje() {

    const dtHoje = moment
      .tz(new Date(), process.env.TIMEZONE)
      .format('YYYY-MM-DD');

    const result = await this.repo
      .createQueryBuilder('movimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .innerJoin('pessoa.usuario', 'usuario')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .select(
        `COUNT(movimentacao.dtLembrete) AS qtdLembrete,
        pessoa.nome,
        pessoa.sobrenome,
        pessoa.celular,
        usuario.email`,
      )
      .where('movimentacao.dtLembrete = :dtHoje', { dtHoje })
      .andWhere('movimentacao.lembreteEnviado = :lembreteEnviado', {
        lembreteEnviado: 0,
      })
      .andWhere('usuario.status = :usuarioStatus', { usuarioStatus: 1 })
      .andWhere('movimentacao.concluido = :concluido', { concluido: 0 })
      .andWhere('movimentacao.status = 1')
      .groupBy('pessoa.id')
      .addGroupBy('usuario.id')
      .getRawMany();

    return result;
  }

  /**
   * @author George Alexandre
   * @description Retorna todas as contas que possuem lembretes marcados para o dia de hoje e
   * o atributo concluido seja igual a zero
   */
  async getContasLembretesHoje() {
    const dtHoje = moment
      .tz(new Date(), process.env.TIMEZONE)
      .format('YYYY-MM-DD');
    const result = await this.repo
      .createQueryBuilder('movimentacao')
      .innerJoinAndSelect('movimentacao.pessoa', 'pessoa')
      .innerJoinAndSelect('pessoa.usuario', 'usuario')
      .innerJoinAndSelect('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .where('movimentacao.dtLembrete = :dtHoje', { dtHoje })
      .andWhere('movimentacao.concluido = :concluido', { concluido: 0 })
      .andWhere('movimentacao.lembreteEnviado = :lembreteEnviado', {
        lembreteEnviado: 0,
      })
      .andWhere('movimentacao.status = 1')
      .andWhere('usuario.status = :usuarioStatus', { usuarioStatus: 1 })
      .getMany();

    return result;
  }

  async updateMany(ids: number[], payload) {
    await this.repo.update(ids, { ...payload });

    return MENSAGENS.SUCESSO;
  }

  async getContasFixas() {
    const dtHoje = moment
      .tz(new Date(), process.env.TIMEZONE)
      .format('YYYY-MM-DD');

    const result = await this.repo
      .createQueryBuilder('movimentacao')
      .innerJoinAndSelect('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoinAndSelect('movimentacao.categoria', 'categoria')
      .innerJoinAndSelect('movimentacao.pessoa', 'pessoa')
      .where('movimentacao.contaFixa = :contaFixa', { contaFixa: 1 })
      .andWhere('movimentacao.dtConta <= :dtHoje', { dtHoje })
      .andWhere('movimentacao.statusContaFixa = :statusContaFixa', {
        statusContaFixa: 0,
      })
      .andWhere('movimentacao.status = 1')
      .getMany();

    return result;
  }

  async saveMany(data: Movimentacao[]) {
    return await this.repo.save(data);
  }

  async save(data: Movimentacao) {
    return await this.repo.save(data);
  }
}

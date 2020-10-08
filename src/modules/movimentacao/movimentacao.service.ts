import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as moment from 'moment-timezone';
import { groupBy } from 'src/common/utils/array';

import { Movimentacao } from '../../entities/movimentacao.entity';
import { MENSAGENS } from './../../common/enums/mensagens';
import { GetMovimentacoesDto } from './dto/get-movimentacoes.dto';

@Injectable()
export class MovimentacaoService extends TypeOrmCrudService<Movimentacao> {
  constructor(@InjectRepository(Movimentacao) repo) {
    super(repo);
  }

  async getSaldo(pessoaId: number, dtPeriodo: string) {
    // AND TO_CHAR(dt_conta, 'YYYY-MM') LIKE '${dtPeriodo}'
    const sql = `
    (
      SELECT SUM(total) AS total
      FROM movimentacoes m2
      WHERE id_pessoa = ${pessoaId}
      AND concluido = 1
      AND id_tipo_movimentacao = 1
    ) -
    (
      SELECT SUM(total) AS total
      FROM movimentacoes m2
      WHERE id_pessoa = ${pessoaId}
      AND concluido = 1
      AND id_tipo_movimentacao = 2
    )
  AS total`;

    const result = await this.repo
      .createQueryBuilder()
      .select(sql)
      .getRawOne();

    return 'total' in result && result.total ? result : { total: '0.00' };
  }

  async getSaldoFuturo(pessoaId: number, dtPeriodo: string) {
    // AND TO_CHAR(dt_conta, 'YYYY-MM') LIKE '${dtPeriodo}'
    const sql = `
    (
      SELECT SUM(total) AS total
      FROM movimentacoes m2
      WHERE id_pessoa = ${pessoaId}
      AND id_tipo_movimentacao = 1
    ) -
    (
      SELECT SUM(total) AS total
      FROM movimentacoes m2
      WHERE id_pessoa = ${pessoaId}
      AND id_tipo_movimentacao = 2
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
    dtPeriodo: string,
  ) {
    const result = await this.repo
      .createQueryBuilder('movimentacao')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .where('movimentacao.concluido = 1')
      // .andWhere(
      //   `TO_CHAR(movimentacao.dtConta, 'YYYY-MM') LIKE :dtPeriodo`,
      //   { dtPeriodo },
      // )
      .andWhere(`tipoMovimentacao.id = :idTipoMovimentacao`, {
        idTipoMovimentacao: Number(idTipoMovimentacao),
      })
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .select('SUM(movimentacao.total) as total')
      .groupBy('tipoMovimentacao.id')
      .getRawOne();

    if (!result) {
      return { total: '0.00' };
    }

    return result;
  }

  async getCountContasByTipoMovimentacaoAndNaoConcluida(
    pessoaId: number,
    idTipoMovimentacao: number,
  ) {
    const result = await this.repo
      .createQueryBuilder('movimentacao')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .where('movimentacao.concluido = 0')
      .andWhere(`tipoMovimentacao.id = :idTipoMovimentacao`, {
        idTipoMovimentacao: Number(idTipoMovimentacao),
      })
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .select('COUNT(movimentacao.id) as total')
      .groupBy('tipoMovimentacao.id')
      .getRawOne();

    if (!result) {
      return { total: '0' };
    }

    return result;
  }

  async getCountContasAtrasadas(
    pessoaId: number,
  ) {
    const dtHoje = moment
      .tz(new Date(), process.env.TIMEZONE)
      .format('YYYY-MM-DD');

    const result = await this.repo
      .createQueryBuilder('movimentacao')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .where('movimentacao.concluido = 0')
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .andWhere(`:dtHoje > TO_CHAR(movimentacao.dtConta, 'YYYY-MM-DD')`, { dtHoje })
      .select('COUNT(movimentacao.id) as total')
      .groupBy('tipoMovimentacao.id')
      .getRawOne();

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
        'categoria.limite as limite'
      ])
      .innerJoin('movimentacao.categoria', 'categoria')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .where('tipoMovimentacao.id = 2')
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .andWhere('categoria.status = 1')
      .groupBy('categoria.id')
      .orderBy('value', 'DESC');

    if (Array.isArray(dtPeriodo)) {
      qb.andWhere(`TO_CHAR(movimentacao.dtConta, 'YYYY-MM') BETWEEN :dtPeriodoIni AND :dtPeriodoFin`, { dtPeriodoIni: dtPeriodo[0], dtPeriodoFin: dtPeriodo[1] });
    } else {
      qb.andWhere(
        `TO_CHAR(movimentacao.dtConta, 'YYYY-MM') LIKE :dtPeriodo`,
        { dtPeriodo },
      )
    }

    const result = await qb.getRawMany();

    return result;
  }

  async getMovimentacoesGroupByTipoMovimentacao(pessoaId: number) {
    const qb = this.repo
      .createQueryBuilder('movimentacao')
      .select([
        'tipoMovimentacao.id as id',
        'tipoMovimentacao.descricao as descricao',
        `TO_CHAR(movimentacao.dtConta, 'YYYY-MM-DD') as name`,
        'SUM(movimentacao.total) as value',
      ])
      .innerJoin('movimentacao.categoria', 'categoria')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .groupBy('movimentacao.dtConta')
      .addGroupBy('tipoMovimentacao.id')
      .orderBy('value', 'DESC');

    let result = await qb.getRawMany();

    result = groupBy(result, 'descricao', true);

    return result;
  }

  async getMovimentacoesPendentes(
    pessoaId: number,
    dtPeriodo: string,
    tipoMovimentacaoId: number,
  ) {
    const result = await this.repo
      .createQueryBuilder('movimentacao')
      .innerJoinAndSelect('movimentacao.categoria', 'categoria')
      .innerJoinAndSelect('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .where('tipoMovimentacao.id = :tipoMovimentacaoId', {
        tipoMovimentacaoId,
      })
      .andWhere('movimentacao.concluido = 0')
      .andWhere(
        `TO_CHAR(movimentacao.dtConta, 'YYYY-MM') LIKE :dtPeriodo`,
        { dtPeriodo },
      )
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .orderBy('movimentacao.dtConta', 'ASC')
      .limit(5)
      .getManyAndCount();

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

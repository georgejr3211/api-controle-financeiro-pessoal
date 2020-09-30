import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as moment from 'moment-timezone';

import { Movimentacao } from '../../entities/movimentacao.entity';
import { MENSAGENS } from './../../common/enums/mensagens';
import { GetMovimentacoesDto } from './dto/get-movimentacoes.dto';

@Injectable()
export class MovimentacaoService extends TypeOrmCrudService<Movimentacao> {
  constructor(@InjectRepository(Movimentacao) repo) {
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

    const result = await this.repo
      .createQueryBuilder()
      .select(sql)
      .getRawOne();

    return result;
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
      .where('movimentacao.pago = 1')
      .andWhere(
        `TO_CHAR(movimentacao.dtLancamento, 'YYYY-MM') LIKE :dtPeriodo`,
        { dtPeriodo },
      )
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

  async getDespesasGroupByCategoria(pessoaId: number, dtPeriodo: string) {
    const result = await this.repo
      .createQueryBuilder('movimentacao')
      .select([
        'categoria.descricao as descricao',
        'SUM(movimentacao.total) as total',
      ])
      .innerJoin('movimentacao.categoria', 'categoria')
      .innerJoin('movimentacao.tipoMovimentacao', 'tipoMovimentacao')
      .innerJoin('movimentacao.pessoa', 'pessoa')
      .where('tipoMovimentacao.id = 2')
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .andWhere(
        `TO_CHAR(movimentacao.dtLancamento, 'YYYY-MM') LIKE :dtPeriodo`,
        { dtPeriodo },
      )
      .groupBy('categoria.id')
      .orderBy('total', 'DESC')
      .getRawMany();

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
      .andWhere('movimentacao.pago = 0')
      .andWhere(
        `TO_CHAR(movimentacao.dtLancamento, 'YYYY-MM') LIKE :dtPeriodo`,
        { dtPeriodo },
      )
      .andWhere('pessoa.id = :pessoaId', { pessoaId })
      .orderBy('movimentacao.dtLancamento', 'ASC')
      .limit(5)
      .getManyAndCount();

    return result;
  }

  /**
   * @author George Alexandre
   * @description Retorna o total de contas que possuem lembretes marcados para o dia de hoje e
   * o atributo pago seja igual a zero
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
        `COUNT(movimentacao.dtLembrete) AS qtdLembrete, pessoa.nome, pessoa.sobrenome, usuario.email`,
      )
      .where('movimentacao.dtLembrete = :dtHoje', { dtHoje })
      .andWhere('movimentacao.lembreteEnviado = :lembreteEnviado', {
        lembreteEnviado: 0,
      })
      .andWhere('usuario.status = :usuarioStatus', { usuarioStatus: 1 })
      .andWhere('movimentacao.pago = :pago', { pago: 0 })
      .groupBy('pessoa.id')
      .addGroupBy('usuario.id')
      .getRawMany();

    return result;
  }

  /**
   * @author George Alexandre
   * @description Retorna todas as contas que possuem lembretes marcados para o dia de hoje e
   * o atributo pago seja igual a zero
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
      .andWhere('movimentacao.pago = :pago', { pago: 0 })
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
      .andWhere('movimentacao.dtLancamento <= :dtHoje', { dtHoje })
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

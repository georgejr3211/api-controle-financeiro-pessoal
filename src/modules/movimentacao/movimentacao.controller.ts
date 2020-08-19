import { MENSAGENS } from './../../common/enums/mensagens';
import { Controller, Get, Param, Query, Req, Res, HttpStatus, Post, Body } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Response } from 'express';
import * as moment from 'moment-timezone';

import { Movimentacao } from '../../entities/movimentacao.entity';
import { MovimentacaoService } from './movimentacao.service';
import { Result } from 'src/common/interfaces/response';
import { ApiTags } from '@nestjs/swagger';

@Crud({
  model: {
    type: Movimentacao,
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 10,
    sort: [{ field: 'id', order: 'DESC' }],
    join: {
      categoria: { eager: true },
      tipoMovimentacao: { eager: true },
      pessoa: { eager: true },
      parcelas: { allow: [] }
    },
  },
})
@ApiTags('Movimentação')
@Controller('movimentacoes')
export class MovimentacaoController {
  dtPeriodo: string;

  constructor(private readonly service: MovimentacaoService) { }

  @Get('saldo')
  async getSaldo(@Req() req, @Query('dtPeriodo') dtPeriodo: string) {
    if (!dtPeriodo) {
      dtPeriodo = moment.utc().format('YYYY-MM');
    } else {
      dtPeriodo = moment.utc(dtPeriodo).format('YYYY-MM');
    }

    const result = await this.service.getSaldo(req.usuario.pessoa.id, dtPeriodo);
    return result;
  }

  @Get('tipo-movimentacao/:tipoMovimentacao/saldo')
  async getSaldoByTipoMovimentacao(
    @Req() req,
    @Param('tipoMovimentacao') tipoMovimentacao: number,
    @Query('dtPeriodo') dtPeriodo: string,
    @Res() res: Response,
  ) {
    if (!dtPeriodo) {
      dtPeriodo = moment.utc().format('YYYY-MM');
    } else {
      dtPeriodo = moment.utc(dtPeriodo).format('YYYY-MM');
    }
    const result = await this.service.getSaldoByTipoMovimentacao(req.usuario.pessoa.id, tipoMovimentacao, dtPeriodo);
    return res.status(HttpStatus.OK).send(result);
  }

  @Get('despesas-categoria')
  async getDespesasGroupByCategoria(
    @Req() req,
    @Query('dtPeriodo') dtPeriodo: string,
    @Res() res: Response,
  ) {
    if (!dtPeriodo) {
      dtPeriodo = moment.utc().format('YYYY-MM');
    } else {
      dtPeriodo = moment.utc(dtPeriodo).format('YYYY-MM');
    }
    const result = await this.service.getDespesasGroupByCategoria(req.usuario.pessoa.id, dtPeriodo);
    return res.status(HttpStatus.OK).send({ data: result });
  }

  @Get('/tipo-movimentacao/:tipoMovimentacao/pendentes')
  async getMovimentacoesPendentes(
    @Req() req,
    @Param('tipoMovimentacao') tipoMovimentacao: number,
    @Query('dtPeriodo') dtPeriodo: string,
    @Res() res: Response,
  ) {
    if (!dtPeriodo) {
      dtPeriodo = moment.utc().format('YYYY-MM');
    } else {
      dtPeriodo = moment.utc(dtPeriodo).format('YYYY-MM');
    }
    const result = await this.service.getMovimentacoesPendentes(req.usuario.pessoa.id, dtPeriodo, tipoMovimentacao);
    return res.status(HttpStatus.OK).send(new Result({ data: result[0], error: null, total: result[1], message: MENSAGENS.SUCESSO }));
  }

}

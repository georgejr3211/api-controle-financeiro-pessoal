import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MovimentacaoService } from 'src/modules/movimentacao/movimentacao.service';
import { sendEmail } from 'src/common/utils/email';
import { Movimentacao } from 'src/entities/movimentacao.entity';
import { add } from 'src/common/utils/date';

@Injectable()
export class CronService {
  constructor(private readonly movimentacaoService: MovimentacaoService) {}

  /**
   * @author George Alexandre
   * @description Envia um E-mail para o usuário das contas que possuem lembrete setado
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handleLembrete(): Promise<void> {
    if (process.env.CRON_SWITCH === 'OFF') {
      return;
    }

    const totalByPessoa = await this.movimentacaoService.getCountContasLembretesHoje();
    if (!totalByPessoa.length) {
      return;
    }

    const contas = await this.movimentacaoService.getContasLembretesHoje();
    const ids = contas.map(cap => cap.id);
    if (ids.length) {
      await this.movimentacaoService.updateMany(ids, { lembreteEnviado: 1 });
    }

    const emails = totalByPessoa.map(movimentacao => movimentacao.email);

    await sendEmail(
      emails,
      `Você possui contas com lembrete para hoje`,
      `Olá, <a href="${process.env.APP_BASE_URL}/auth/movimentacoes">Clique aqui</a> para visualizar seus lembretes`,
      `<h1>Olá, <a href="${process.env.APP_BASE_URL}/auth/movimentacoes">Clique aqui</a> para visualizar seus lembretes</h1>`,
    );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleContaFixa(): Promise<void> {
    if (process.env.CRON_SWITCH === 'OFF') {
      return;
    }

    let contasFixas = await this.movimentacaoService.getContasFixas();
    if (!contasFixas.length) {
      return;
    }

    contasFixas = contasFixas.map(cf => {
      cf.statusContaFixa = 1;

      return cf;
    });

    await this.movimentacaoService.saveMany(contasFixas);

    const lancamentosFuturos = contasFixas.map(contaFixa => {
      const dtLembrete = contaFixa.dtLembrete
        ? new Date(add(contaFixa.dtLembrete, 1, 'month', 'YYYY-MM-DD'))
        : null;
      const dtLancamento = new Date(
        add(contaFixa.dtLancamento, 1, 'month', 'YYYY-MM-DD'),
      );

      const movimentacao = new Movimentacao({
        ...contaFixa,
        dtLancamento,
        dtConclusao: null,
        dtLembrete,
        pago: 0,
        lembreteEnviado: 0,
        statusContaFixa: 0,
      });

      delete movimentacao.id;
      return movimentacao;
    });

    await this.movimentacaoService.saveMany(lancamentosFuturos);
  }
}

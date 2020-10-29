import { HttpService, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MovimentacaoService } from 'src/modules/movimentacao/movimentacao.service';
import { sendEmail } from 'src/common/utils/email';
import { Movimentacao } from 'src/entities/movimentacao.entity';
import { add } from 'src/common/utils/date';
import { MessageService } from 'src/common/utils/message';

@Injectable()
export class CronService {

  constructor(
    private readonly movimentacaoService: MovimentacaoService,
    private readonly messageService: MessageService,
  ) { }

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

    const celulares = totalByPessoa.map(movimentacao => movimentacao.celular);
    const emails = totalByPessoa.map(movimentacao => movimentacao.email);

    await sendEmail(
      emails,
      `Você possui contas com lembrete para hoje`,
      `Olá, <a href="${process.env.PORTAL_BASE_URL}/auth/movimentacoes">Clique aqui</a> para visualizar seus lembretes`,
      `<h1>Olá, <a href="${process.env.PORTAL_BASE_URL}/auth/movimentacoes">Clique aqui</a> para visualizar seus lembretes</h1>`,
    );

    this.messageService.sendBulkSMSMessage(celulares, `Olá, acesse ${process.env.PORTAL_BASE_URL}/auth/movimentacoes para visualizar seus lembretes`);

  }

  /**
   * @author George Alexandre
   * @description Cria uma nova conta para o próximo mês a partir de uma conta fixa
   */
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

      const dtConta = new Date(
        add(contaFixa.dtConta, 1, 'month', 'YYYY-MM-DD'),
      );

      const movimentacao = new Movimentacao({
        ...contaFixa,
        dtConta,
        dtConclusao: null,
        dtLembrete,
        concluido: 0,
        lembreteEnviado: 0,
        statusContaFixa: 0,
      });

      delete movimentacao.id;
      return movimentacao;
    });

    await this.movimentacaoService.saveMany(lancamentosFuturos);
  }

}

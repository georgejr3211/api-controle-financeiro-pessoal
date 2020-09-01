import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MovimentacaoService } from 'src/modules/movimentacao/movimentacao.service';
import { sendEmail } from 'src/common/utils/email';
import { Movimentacao } from 'src/entities/movimentacao.entity';
import { add } from 'src/common/utils/date';
import * as moment from 'moment-timezone';

@Injectable()
export class CronService {
  constructor(private readonly movimentacaoService: MovimentacaoService) { }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleLembreteContasAPagar(): Promise<void> {
    const totalByPessoa = await this.movimentacaoService.getCountContasAPagar();
    if (!totalByPessoa.length) {
      return;
    }

    const contasAPagar = await this.movimentacaoService.getContasAPagar();
    const ids = contasAPagar.map(cap => cap.id);
    if (ids.length) {
      await this.movimentacaoService.updateMany(ids, { lembreteEnviado: 1 });
    }
    totalByPessoa.map(async movimentacao => {
      const { nome, sobrenome, email, qtdLembrete } = movimentacao;
      await sendEmail(email, `Você possui ${qtdLembrete} contas a pagar com lembrete para hoje`, `Olá ${nome} ${sobrenome}, acesse ${process.env.API_BASE_URL} para visualizar seus lembretes`, `<h1>Olá ${nome} ${sobrenome}, acesse ${process.env.API_BASE_URL} para visualizar seus lembretes</h1>`);
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleContaFixa(): Promise<void> {
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
      const dtLembrete = contaFixa.dtLembrete ? new Date(add(contaFixa.dtLembrete, 1, 'month', 'YYYY-MM-DD')) : null;
      const dtLancamento = new Date(add(contaFixa.dtLancamento, 1, 'month', 'YYYY-MM-DD'));
      const dtVencimento = contaFixa.dtVencimento ? new Date(add(contaFixa.dtVencimento, 1, 'month', 'YYYY-MM-DD')) : null;
      const movimentacao = new Movimentacao({
        ...contaFixa,
        dtLancamento,
        dtVencimento,
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

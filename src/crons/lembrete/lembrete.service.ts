import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MovimentacaoService } from 'src/modules/movimentacao/movimentacao.service';
import { sendEmail } from 'src/common/utils/email';

@Injectable()
export class LembreteService {
  constructor(private readonly movimentacaoService: MovimentacaoService) { }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleLembreteContasAPagar() {
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
}

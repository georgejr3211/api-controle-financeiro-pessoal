import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MovimentacaoService } from 'src/modules/movimentacao/movimentacao.service';

import { LembreteService } from './lembrete/lembrete.service';
import { MovimentacaoModule } from 'src/modules/movimentacao/movimentacao.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MovimentacaoModule,
  ],
  providers: [
    LembreteService,
  ],
})
export class CronModule { }

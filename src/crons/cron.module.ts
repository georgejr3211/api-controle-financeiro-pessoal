import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MovimentacaoModule } from 'src/modules/movimentacao/movimentacao.module';

import { CronService } from './cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MovimentacaoModule,
  ],
  providers: [
    CronService,
  ],
})
export class CronModule { }

import { HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MessageService } from 'src/common/utils/message';
import { MovimentacaoModule } from 'src/modules/movimentacao/movimentacao.module';

import { CronService } from './cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MovimentacaoModule,
    HttpModule,
  ],
  providers: [
    CronService,
    MessageService,
  ],
})
export class CronModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TipoMovimentacao } from '../../entities/tipo-movimentacao.entity';
import { TipoMovimentacaoController } from './tipo-movimentacao.controller';
import { TipoMovimentacaoService } from './tipo-movimentacao.service';

@Module({
  imports: [TypeOrmModule.forFeature([TipoMovimentacao])],
  controllers: [TipoMovimentacaoController],
  providers: [TipoMovimentacaoService],
  exports: [TipoMovimentacaoService],
})
export class TipoMovimentacaoModule { }

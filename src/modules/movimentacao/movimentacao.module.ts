import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Movimentacao } from './../../entities/movimentacao.entity';
import { MovimentacaoController } from './movimentacao.controller';
import { MovimentacaoService } from './movimentacao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movimentacao])],
  controllers: [MovimentacaoController],
  providers: [MovimentacaoService],
  exports: [MovimentacaoService],
})
export class MovimentacaoModule {}

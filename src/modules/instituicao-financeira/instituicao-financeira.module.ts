import { Module } from '@nestjs/common';
import { InstituicaoFinanceiraController } from './instituicao-financeira.controller';
import { InstituicaoFinanceiraService } from './instituicao-financeira.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstituicaoFinanceira } from 'src/entities/instituicao-financeira.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InstituicaoFinanceira])],
  controllers: [InstituicaoFinanceiraController],
  providers: [InstituicaoFinanceiraService],
  exports: [InstituicaoFinanceiraService],
})
export class InstituicaoFinanceiraModule {}

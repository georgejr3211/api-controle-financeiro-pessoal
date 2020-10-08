import { Module } from '@nestjs/common';
import { TarefaController } from './tarefa.controller';
import { TarefaService } from './tarefa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarefa } from 'src/entities/tarefa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarefa])],
  controllers: [TarefaController],
  providers: [TarefaService],
  exports: [TarefaService],
})
export class TarefaModule {}

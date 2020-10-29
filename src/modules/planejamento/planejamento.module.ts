import { Module } from '@nestjs/common';
import { PlanejamentoController } from './planejamento.controller';
import { PlanejamentoService } from './planejamento.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planejamento } from 'src/entities/planejamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Planejamento])],
  controllers: [PlanejamentoController],
  providers: [PlanejamentoService],
  exports: [PlanejamentoService],
})
export class PlanejamentoModule {}

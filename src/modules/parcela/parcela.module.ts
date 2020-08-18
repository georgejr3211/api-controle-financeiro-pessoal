import { Module } from '@nestjs/common';
import { ParcelaController } from './parcela.controller';
import { ParcelaService } from './parcela.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parcela } from 'src/entities/parcela.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parcela])],
  controllers: [ParcelaController],
  providers: [ParcelaService],
  exports: [ParcelaService],
})
export class ParcelaModule {}

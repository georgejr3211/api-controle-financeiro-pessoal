import { Module } from '@nestjs/common';
import { TipoContaController } from './tipo-conta.controller';
import { TipoContaService } from './tipo-conta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoConta } from 'src/entities/tipo-conta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoConta])],
  controllers: [TipoContaController],
  providers: [TipoContaService],
  exports: [TipoContaService],
})
export class TipoContaModule {}

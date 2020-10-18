import { Module } from '@nestjs/common';
import { ObjetivoController } from './objetivo.controller';
import { ObjetivoService } from './objetivo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objetivo } from 'src/entities/objetivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Objetivo])],
  controllers: [ObjetivoController],
  providers: [ObjetivoService],
  exports: [ObjetivoService],
})
export class ObjetivoModule {}

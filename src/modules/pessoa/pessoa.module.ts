import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from '../../entities/pessoa.entity';

import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pessoa,
    ]),
  ],
  controllers: [PessoaController],
  providers: [PessoaService],
  exports: [PessoaService],
})
export class PessoaModule { }

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { createTestConfiguration } from '../../config/test.database';
import { Repository } from 'typeorm';

import { TipoMovimentacao } from '../../entities/tipo-movimentacao.entity';
import { TipoMovimentacaoController } from './tipo-movimentacao.controller';
import { TipoMovimentacaoService } from './tipo-movimentacao.service';

describe('TipoMovimentacao Controller', () => {
  let controller: TipoMovimentacaoController;
  let repository: Repository<TipoMovimentacao>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([TipoMovimentacao]),
      ],
      controllers: [TipoMovimentacaoController],
      providers: [TipoMovimentacaoService],
    }).compile();

    controller = module.get<TipoMovimentacaoController>(TipoMovimentacaoController);
    repository = module.get<Repository<TipoMovimentacao>>(getRepositoryToken(TipoMovimentacao));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

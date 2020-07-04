import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from './../../config/test.database';
import { TipoMovimentacao } from './../../entities/tipo-movimentacao.entity';
import { TipoMovimentacaoService } from './tipo-movimentacao.service';

describe('TipoMovimentacaoService', () => {
  let service: TipoMovimentacaoService;
  let repository: Repository<TipoMovimentacao>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([TipoMovimentacao]),
      ],
      providers: [TipoMovimentacaoService],
    }).compile();

    service = module.get<TipoMovimentacaoService>(TipoMovimentacaoService);
    repository = module.get<Repository<TipoMovimentacao>>(getRepositoryToken(TipoMovimentacao));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

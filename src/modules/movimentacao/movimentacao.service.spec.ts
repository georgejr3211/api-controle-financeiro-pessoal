import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Categoria } from '../../entities/categoria.entity';
import { Movimentacao } from '../../entities/movimentacao.entity';
import { TipoMovimentacao } from '../../entities/tipo-movimentacao.entity';
import { Pessoa } from './../../entities/pessoa.entity';
import { MovimentacaoService } from './movimentacao.service';

describe('MovimentacaoService', () => {
  let service: MovimentacaoService;
  let repository: Repository<Movimentacao>;
  let tipoMovimentacaoRepository: Repository<TipoMovimentacao>;
  let pessoaRepository: Repository<Pessoa>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Movimentacao, TipoMovimentacao, Pessoa]),
      ],
      providers: [MovimentacaoService],
    }).compile();

    service = module.get<MovimentacaoService>(MovimentacaoService);
    repository = module.get<Repository<Movimentacao>>(getRepositoryToken(Movimentacao));
    tipoMovimentacaoRepository = module.get<Repository<TipoMovimentacao>>(getRepositoryToken(TipoMovimentacao));
    pessoaRepository = module.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

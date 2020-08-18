import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Movimentacao } from '../../entities/movimentacao.entity';
import { MovimentacaoController } from './movimentacao.controller';
import { MovimentacaoService } from './movimentacao.service';

describe('Movimentacao Controller', () => {
  let controller: MovimentacaoController;
  let repository: Repository<Movimentacao>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Movimentacao]),
      ],
      controllers: [MovimentacaoController],
      providers: [MovimentacaoService],
    }).compile();

    controller = module.get<MovimentacaoController>(MovimentacaoController);
    repository = module.get<Repository<Movimentacao>>(getRepositoryToken(Movimentacao));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

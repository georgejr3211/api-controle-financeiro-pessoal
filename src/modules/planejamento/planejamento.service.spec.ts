import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Planejamento } from '../../entities/planejamento.entity';
import { PlanejamentoService } from './planejamento.service';

describe('PlanejamentoService', () => {
  let service: PlanejamentoService;
  let repository: Repository<Planejamento>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Planejamento]),
      ],
      providers: [PlanejamentoService],
    }).compile();

    service = module.get<PlanejamentoService>(PlanejamentoService);
    repository = module.get<Repository<Planejamento>>(getRepositoryToken(Planejamento));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

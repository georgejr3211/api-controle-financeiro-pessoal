import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Tarefa } from '../../entities/tarefa.entity';
import { TarefaService } from './tarefa.service';

describe('TarefaService', () => {
  let service: TarefaService;
  let repository: Repository<Tarefa>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Tarefa]),
      ],
      providers: [TarefaService],
    }).compile();

    service = module.get<TarefaService>(TarefaService);
    repository = module.get<Repository<Tarefa>>(getRepositoryToken(Tarefa));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Tarefa } from '../../entities/tarefa.entity';
import { TarefaController } from './tarefa.controller';
import { TarefaService } from './tarefa.service';

describe('Tarefa Controller', () => {
  let controller: TarefaController;
  let repository: Repository<Tarefa>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Tarefa]),
      ],
      controllers: [TarefaController],
      providers: [TarefaService],
    }).compile();

    controller = module.get<TarefaController>(TarefaController);
    repository = module.get<Repository<Tarefa>>(getRepositoryToken(Tarefa));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

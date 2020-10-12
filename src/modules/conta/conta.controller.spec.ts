import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Conta } from '../../entities/conta.entity';
import { ContaController } from './conta.controller';
import { ContaService } from './conta.service';

describe('Conta Controller', () => {
  let controller: ContaController;
  let repository: Repository<Conta>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Conta]),
      ],
      controllers: [ContaController],
      providers: [ContaService],
    }).compile();

    controller = module.get<ContaController>(ContaController);
    repository = module.get<Repository<Conta>>(getRepositoryToken(Conta));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Conta } from '../../entities/conta.entity';
import { ContaService } from './conta.service';

describe('ContaService', () => {
  let service: ContaService;
  let repository: Repository<Conta>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Conta]),
      ],
      providers: [ContaService],
    }).compile();

    service = module.get<ContaService>(ContaService);
    repository = module.get<Repository<Conta>>(getRepositoryToken(Conta));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

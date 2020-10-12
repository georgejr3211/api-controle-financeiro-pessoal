import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { InstituicaoFinanceira } from '../../entities/instituicao-financeira.entity';
import { InstituicaoFinanceiraService } from './instituicao-financeira.service';

describe('InstituicaoFinanceiraService', () => {
  let service: InstituicaoFinanceiraService;
  let repository: Repository<InstituicaoFinanceira>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([InstituicaoFinanceira]),
      ],
      providers: [InstituicaoFinanceiraService],
    }).compile();

    service = module.get<InstituicaoFinanceiraService>(InstituicaoFinanceiraService);
    repository = module.get<Repository<InstituicaoFinanceira>>(getRepositoryToken(InstituicaoFinanceira));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

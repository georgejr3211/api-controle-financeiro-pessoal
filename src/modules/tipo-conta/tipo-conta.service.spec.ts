import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { TipoConta } from '../../entities/tipo-conta.entity';
import { TipoContaService } from './tipo-conta.service';

describe('TipoContaService', () => {
  let service: TipoContaService;
  let repository: Repository<TipoConta>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([TipoConta]),
      ],
      providers: [TipoContaService],
    }).compile();

    service = module.get<TipoContaService>(TipoContaService);
    repository = module.get<Repository<TipoConta>>(getRepositoryToken(TipoConta));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

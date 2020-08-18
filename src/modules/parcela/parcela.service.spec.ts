import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Parcela } from '../../entities/parcela.entity';
import { ParcelaService } from './parcela.service';

describe('ParcelaService', () => {
  let service: ParcelaService;
  let repository: Repository<Parcela>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Parcela]),
      ],
      providers: [ParcelaService],
    }).compile();

    service = module.get<ParcelaService>(ParcelaService);
    repository = module.get<Repository<Parcela>>(getRepositoryToken(Parcela));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

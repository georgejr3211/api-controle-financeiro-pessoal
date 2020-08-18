import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Pessoa } from '../../entities/pessoa.entity';
import { PessoaController } from './pessoa.controller';
import { PessoaService } from './pessoa.service';

describe('Pessoa Controller', () => {
  let controller: PessoaController;
  let repository: Repository<Pessoa>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Pessoa]),
      ],
      controllers: [PessoaController],
      providers: [PessoaService],
    }).compile();

    controller = module.get<PessoaController>(PessoaController);
    repository = module.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    jest.setTimeout(50000);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

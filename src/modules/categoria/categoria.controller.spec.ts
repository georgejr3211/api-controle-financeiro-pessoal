import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Categoria } from '../../entities/categoria.entity';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';

describe('Categoria Controller', () => {
  let controller: CategoriaController;
  let repository: Repository<Categoria>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: ['.env.test'] }),
        TypeOrmModule.forRoot(createTestConfiguration()),
        TypeOrmModule.forFeature([Categoria]),
      ],
      controllers: [CategoriaController],
      providers: [CategoriaService],
    }).compile();

    controller = module.get<CategoriaController>(CategoriaController);
    repository = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
    jest.setTimeout(50000);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

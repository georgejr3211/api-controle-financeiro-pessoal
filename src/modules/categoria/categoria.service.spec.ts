import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createTestConfiguration } from '../../config/test.database';
import { Categoria } from '../../entities/categoria.entity';
import { CategoriaService } from './categoria.service';

export class MockRepository<T> {
  public metadata = { connection: { options: { type: null } }, columns: [], relations: [] }

  public createQueryBuilder = jest.fn(() => this.queryBuilder);

  public manager = { transaction: a => Promise.resolve(a()) };

  public save = jest.fn();
  public delete = jest.fn();
  public update = jest.fn();
  public findOne = jest.fn();
  public findOneOrFail = jest.fn();
  public find = jest.fn();
  public getMany = jest.fn();

  public queryBuilder = {
    offset: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    addFrom: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getMany: jest.fn(),
    getOne: jest.fn(),
    delete: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis()
  };
}

describe('CategoriaService', () => {
  let service: CategoriaService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CategoriaService,
        {
          provide: getRepositoryToken(Categoria),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create a category', () => {
    it('should create a category', async () => {
      const repo = new MockRepository();
      const category = { descricao: 'Nova categoria', limite: 0, pessoa: { id: 1 }, planejamento: { id: 1 } };
      repo.save.mockReturnValue(category);

      expect(repo.save(category)).toBe(category);
      expect(repo.save).toBeCalledTimes(1);
    });
  });
});

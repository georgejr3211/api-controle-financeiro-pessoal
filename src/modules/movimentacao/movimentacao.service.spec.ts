import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Movimentacao } from '../../entities/movimentacao.entity';
import { MovimentacaoService } from './movimentacao.service';

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
    getRawOne: jest.fn(),
    getOne: jest.fn(),
    select: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnThis(),
  };
}

describe('MovimentacaoService', () => {
  let service: MovimentacaoService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        MovimentacaoService,
        {
          provide: getRepositoryToken(Movimentacao),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get<MovimentacaoService>(MovimentacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create a category', () => {
    it('deve retornar o saldo total', async () => {
      const repo = new MockRepository();

      repo.createQueryBuilder().select().getRawOne.mockReturnValue(() => ({ total: '2.50' }));

      expect(await service.getSaldo(1, [])).toHaveProperty('total');
    });
  });
});

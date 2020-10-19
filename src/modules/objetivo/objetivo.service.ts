import { Objetivo } from '../../entities/objetivo.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDto } from '../../dtos/query.dto';

@Injectable()
export class ObjetivoService extends TypeOrmCrudService<Objetivo> {
  constructor(@InjectRepository(Objetivo) repo) {
    super(repo);
  }

  async getAllObjetivosByPessoa(query: QueryDto) {
    const qb = this.repo.createQueryBuilder('objetivo')
      .select(`
        objetivo.id as id,
        objetivo.descricao as descricao,
        objetivo.total,
        objetivo.dtConclusao as dtConclusao,
        COALESCE(SUM(movimentacoes.total), 0) AS total_depositado
      `)
      .leftJoin('objetivo.movimentacoes', 'movimentacoes')
      .where('objetivo.pessoa = :pessoaId', { pessoaId: query.pessoaId })
      .take(query.limit)
      .offset((query.offset * query.limit))
      .groupBy('objetivo.id');

    if (query.search) {
      qb.andWhere('objetivo.descricao ILIKE :descricao', { descricao: `%${query.search}%` });
    }

    const result = await qb.getRawMany();

    return result;
  }
}

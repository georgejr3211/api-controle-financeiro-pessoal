import { Conta } from '../../entities/conta.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContaService extends TypeOrmCrudService<Conta> {
  constructor(@InjectRepository(Conta) repo) {
    super(repo);
  }
}

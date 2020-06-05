import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Pessoa } from '../entities/pessoa.entity';
import { Usuario } from '../entities/usuario.entity';
import { EntitySchema } from 'typeorm';

// tslint:disable-next-line: ban-types
type Entity = Function | string | EntitySchema<any>;

export const createTestConfiguration = (): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: ':memory:',
  entities: [
    __dirname + '../../entities/*.entity.{ts,js}',
  ],
  // name: 'db_tests',
  dropSchema: true,
  synchronize: true,
  logging: false,
  keepConnectionAlive: true,
});

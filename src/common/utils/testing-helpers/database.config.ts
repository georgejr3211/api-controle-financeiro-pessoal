import { createConnection, EntitySchema } from 'typeorm';
// tslint:disable-next-line: ban-types
type Entity = Function | string | EntitySchema<any>;

export async function createMemDB(entities: Entity[]) {
  return createConnection({
    type: 'sqlite',
    database: ':memory:',
    entities,
    dropSchema: true,
    synchronize: true,
    logging: false,
  });
}

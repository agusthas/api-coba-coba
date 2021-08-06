import { createConnection, getConnection } from 'typeorm';

export class TestingDatabase {
  private connectionName: string = 'e2e_test_connection';

  constructor(public dbName: string = 'e2e_test_db') {}

  public async reset(): Promise<void> {
    process.env.DB_NAME = this.dbName;

    // console.log(`Dropping ${this.dbName} database and recreating it`);
    const conn = await createConnection({
      name: this.connectionName,
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
    });

    await conn.query(`DROP DATABASE IF EXISTS ${this.dbName}`);
    await conn.query(`CREATE DATABASE ${this.dbName}`);

    await conn.close();
  }

  public async createEntities(): Promise<void> {
    // console.log(`Creating entities in ${this.dbName}`);
    await createConnection({
      name: this.connectionName,
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: this.dbName,
      entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
      synchronize: true,
    });
  }

  public async close(): Promise<void> {
    // console.log(`Closing connection to ${this.dbName} database`);
    const conn = getConnection(this.connectionName);

    await conn.close();
  }
}

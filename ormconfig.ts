/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'path';

import * as dotenv from 'dotenv';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

dotenv.config();

const config: MysqlConnectionOptions = {
  type: <'mysql' | 'mariadb'>process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(<string>process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [path.resolve(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [path.resolve(__dirname, 'src/database/migrations/**/*.ts')],
  cli: {
    migrationsDir: path.resolve('src/database/migrations'),
  },
};
// eslint-disable-next-line import/no-default-export
export default config;

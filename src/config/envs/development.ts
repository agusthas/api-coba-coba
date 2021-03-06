export const config = {
  db: {
    type: process.env.DB_TYPE || 'mysql',
    // https://typeorm.io/#/connection-options/common-connection-options
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'username',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'dbname',
    extra: {
      connectionLimit: 10,
    },
    // autoLoadEntities: true,
    logging: true,
    synchronize: true,
    dropSchema: true,
    migrationsRun: true,
    entities: [`${__dirname}/../../**/*.entity.{js,ts}`],
    // subscribers: [`${__dirname}/../../subscriber/**/*.{js,ts}`],
    migrations: [`${__dirname}/../../database/migrations/**/*.{js,ts}`],
  },
  foo: 'dev-bar',
};

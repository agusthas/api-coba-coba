import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { TestingDatabase } from '../test-utils';

let app: INestApplication;
const testDb = new TestingDatabase();

describe('AppController (e2e)', () => {
  beforeAll(async () => {
    await testDb.reset();
    await testDb.createEntities();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => request(app.getHttpServer()).get('/').expect(200));

  afterAll(async () => {
    await app.close();
    await testDb.close();
  });
});

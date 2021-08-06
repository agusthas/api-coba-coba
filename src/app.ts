import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { VALIDATION_PIPE_OPTIONS } from './common/constants';
import { Logger } from './common/services';

(async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(await app.resolve(Logger));
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));

  app.setGlobalPrefix('api/v1');

  const config = app.get(ConfigService);
  await app.listen(config.get<number>('app.port') || 3000, '0.0.0.0');

  // eslint-disable-next-line no-console
  console.log(
    `--- BOOTSTRAP --- [${new Date().toLocaleString()}] on: ${await app.getUrl()}`,
  );
})();

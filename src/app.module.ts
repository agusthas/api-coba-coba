import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { LoggingMiddleware } from './common/middleware';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

/**
 * Import and provide app/global related classses.
 *
 * @module
 */
@Module({
  imports: [ConfigModule, DatabaseModule, CommonModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}

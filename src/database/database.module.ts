import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        ...config.get('db'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

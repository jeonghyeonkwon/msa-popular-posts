import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { KAFKA_OPTION, TYPEORM_OPTION } from './constants';

import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DataSource } from 'typeorm';
import { RedisPopularModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(TYPEORM_OPTION),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...(KAFKA_OPTION as any),
      },
    ]),
    PostsModule,
    UsersModule,
    RedisPopularModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

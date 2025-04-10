import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entities';
import { Users } from 'src/users/users.entities';
import { UsersModule } from 'src/users/users.module';
import { RedisPopularModule } from 'src/redis/redis.module';
import { HttpModule } from '@nestjs/axios';
import { PostsRepository } from './posts.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Users]),
    HttpModule,
    UsersModule,
    RedisPopularModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}

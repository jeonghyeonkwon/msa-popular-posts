import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entities';
import { Users } from 'src/users/users.entities';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Users]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

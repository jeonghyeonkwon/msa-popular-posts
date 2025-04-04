import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './posts.entities';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,

    private readonly usersService: UsersService,
  ) {}

  async createPosts(usersId: string, posts: Posts) {
    const user = await this.usersService.findUsersById(usersId);
    posts.user = user!;
    await this.postsRepository.save(posts);
  }
}

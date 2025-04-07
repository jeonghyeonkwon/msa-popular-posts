import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './posts.entities';
import { UsersService } from 'src/users/users.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PopularPostsDto } from './dtos/response';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  async createPosts(usersId: string, posts: Posts) {
    const user = await this.usersService.findUsersById(usersId);
    posts.user = user!;
    return await this.postsRepository.save(posts);
  }
  async checkAndCreatePosts(postsId: string): Promise<Posts> {
    const posts = await this.postsRepository.findOne({
      where: {
        id: postsId,
      },
    });

    if (!posts) {
      try {
        const { data } = await firstValueFrom(
          this.httpService.get<PopularPostsDto>(
            `${process.env.BOARD_SERVICE}/api/popular-posts/${postsId}`,
          ),
        );

        const createdPosts = new Posts(
          data.boardId,
          data.title,
          data.createdAt,
          data.viewCount,
          data.commentCount,
          data.likeCount,
        );

        return await this.createPosts(data.usersId, createdPosts);
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    }
    return posts!;
  }
}

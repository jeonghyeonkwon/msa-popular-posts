import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Posts } from './posts.entities';

@Injectable()
export class PostsRepository extends Repository<Posts> {
  constructor(private dataSource: DataSource) {
    super(Posts, dataSource.createEntityManager());
  }

  async createPosts(posts: Posts) {
    return await this.insert(posts);
  }

  async findById(postsId: string) {
    return await this.findOne({
      where: {
        id: postsId,
      },
    });
  }

  async findByIds(postsIds: string[]) {
    return await this.find({
      where: {
        id: In(postsIds),
      },
      relations: ['user'],
    });
  }

  async addCommentCountByIds(postsId: string) {
    return await this.update(
      { id: postsId },
      { commentCount: () => 'commentCount + 1' },
    );
  }
}

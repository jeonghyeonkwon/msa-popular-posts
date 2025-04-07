import { Injectable } from '@nestjs/common';

import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Posts } from 'src/posts/posts.entities';
import { SCORE_ENUM } from 'src/posts/posts.enum';
import { calculatorScore } from 'src/util/calculator';
@Injectable()
export class RedisService {
  ZADD_KEY: string = 'POPULAR_BOARD';

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setPosts(postsId: string) {
    await this.redis.zadd(
      this.ZADD_KEY,
      SCORE_ENUM.CREATE_BOARD_SCORE,
      postsId,
    );
  }

  async setViewScore(postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY,
      SCORE_ENUM.BOARD_VIEW_SCORE,
      postsId,
    );
  }
  async setLikeCreateScore(postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY,
      SCORE_ENUM.BOARD_LIKE_CREATE_SCORE,
      postsId,
    );
  }
  async setLikeRemoveScore(postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY,
      SCORE_ENUM.BOARD_LIKE_DELETE_SCORE,
      postsId,
    );
  }
  async setCommentCreatedScore(postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY,
      SCORE_ENUM.BOARD_COMMENT_CREATE_SCORE,
      postsId,
    );
  }

  async isExistMember(postsId: string) {
    const response = await this.redis.zscore(this.ZADD_KEY, postsId);

    return response !== null;
  }
  async syncData(posts: Posts) {
    const rankScore = calculatorScore(
      posts.viewCount,
      posts.likeCount,
      posts.commentCount,
    );

    await this.redis.zadd(this.ZADD_KEY, rankScore, posts.id);
  }
}

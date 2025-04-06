import { Injectable } from '@nestjs/common';

import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
  ZADD_KEY: string = 'POPULAR_BOARD';
  CREATE_BOARD_SCORE: number = 0;
  BOARD_VIEW_SCORE: number = 1;
  BOARD_LIKE_CREATE_SCORE: number = 2;
  BOARD_LIKE_DELETE_SCORE: number = -2;
  BOARD_COMMENT_CREATE_SCORE: number = 3;

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setPosts(postsId: string) {
    await this.redis.zadd(this.ZADD_KEY, this.CREATE_BOARD_SCORE, postsId);
  }

  async setViewScore(postsId: string) {
    await this.redis.zincrby(this.ZADD_KEY, this.BOARD_VIEW_SCORE, postsId);
  }
  async setLikeCreateScore(postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY,
      this.BOARD_LIKE_CREATE_SCORE,
      postsId,
    );
  }
  async setLikeRemoveScore(postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY,
      this.BOARD_LIKE_DELETE_SCORE,
      postsId,
    );
  }
  async setCommentCreatedScore(postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY,
      this.BOARD_COMMENT_CREATE_SCORE,
      postsId,
    );
  }
}

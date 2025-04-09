import { Injectable } from '@nestjs/common';

import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Posts } from 'src/posts/posts.entities';
import { SCORE_ENUM } from 'src/posts/posts.enum';
import { calculatorScore } from 'src/util/calculator';
import { PopularDaysDto } from 'src/posts/dtos/response';
@Injectable()
export class RedisService {
  ZADD_KEY = (days: string): string => `popular-board::${days}`;
  DAYS_SPLILIT_DELIMITER = '::';

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setPosts(days: string, postsId: string) {
    await this.redis.zadd(
      this.ZADD_KEY(days),
      SCORE_ENUM.CREATE_BOARD_SCORE,
      postsId,
    );
  }

  async setViewScore(days: string, postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY(days),
      SCORE_ENUM.BOARD_VIEW_SCORE,
      postsId,
    );
  }
  async setLikeCreateScore(days: string, postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY(days),
      SCORE_ENUM.BOARD_LIKE_CREATE_SCORE,
      postsId,
    );
  }
  async setLikeRemoveScore(days: string, postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY(days),
      SCORE_ENUM.BOARD_LIKE_DELETE_SCORE,
      postsId,
    );
  }
  async setCommentCreatedScore(days: string, postsId: string) {
    await this.redis.zincrby(
      this.ZADD_KEY(days),
      SCORE_ENUM.BOARD_COMMENT_CREATE_SCORE,
      postsId,
    );
  }

  async isExistMember(days: string, postsId: string) {
    const response = await this.redis.zscore(this.ZADD_KEY(days), postsId);

    return response !== null;
  }
  async syncData(days: string, posts: Posts) {
    const rankScore = calculatorScore(
      posts.viewCount,
      posts.likeCount,
      posts.commentCount,
    );

    await this.redis.zadd(this.ZADD_KEY(days), rankScore, posts.id);
  }

  async getDays() {
    const response = await this.redis.scan(0);
    const days = response[1].map(
      (days) => days.split(this.DAYS_SPLILIT_DELIMITER)[1],
    );
    return new PopularDaysDto(days);
  }

  async getTop10Posts(days: string): Promise<string[]> {
    return await this.redis.zrevrange(this.ZADD_KEY(days), 0, -1);
  }
}

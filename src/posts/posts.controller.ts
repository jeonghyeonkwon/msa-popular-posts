import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  BoardCreatePayload,
  BoardEtcPayload,
} from 'src/kafka/dtos/payload.dto';
import { TypeEnum } from 'src/kafka/dtos/type.enum';
import { KafkaMessageDto } from 'src/kafka/dtos/message.dto';
import { Posts } from './posts.entities';
import { RedisService } from 'src/redis/redis.service';
import { getRedisKey, isWithinLastWeek } from 'src/util/custom-date';

@Controller('api')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly redisService: RedisService,
  ) {}

  @MessagePattern('board')
  async handleBoard(@Payload() response: any) {
    if (response.type === TypeEnum.BOARD_CREATE) {
      const { payload } = response as KafkaMessageDto<BoardCreatePayload>;
      const posts = new Posts(
        payload.boardId,
        payload.title,
        payload.createdAt,
      );
      await this.postsService.createPosts(payload.usersId, posts);

      const createDate = new Date(payload.createdAt);

      if (isWithinLastWeek(createDate)) {
        await this.redisService.setPosts(
          getRedisKey(createDate),
          payload.boardId,
        );
      }
    }

    return;
  }
  @MessagePattern('board-view')
  async handleBoardView(@Payload() response: any) {
    if (response.type === TypeEnum.BOARD_VIEW) {
      const { payload } = response as KafkaMessageDto<BoardEtcPayload>;
      console.log('게시글 조회', payload.boardId);
      const postCreatedAt = new Date(payload.boardCreatedAt);

      //7일 이내 생성된 게시글 이라면
      if (isWithinLastWeek(postCreatedAt)) {
        const isExist = await this.redisService.isExistMember(
          getRedisKey(postCreatedAt),
          payload.boardId,
        );

        if (!isExist) {
          const posts = await this.postsService.checkAndCreatePosts(
            payload.boardId,
          );

          await this.redisService.syncData(getRedisKey(postCreatedAt), posts);
        }
        await this.redisService.setViewScore(
          getRedisKey(postCreatedAt),
          payload.boardId,
        );
        return;
      }

      // 7일 이전이라면 게시글 체크 후 없다면 생성
      await this.postsService.checkAndCreatePosts(payload.boardId);

      return;
    }
  }
  @MessagePattern('board-comment')
  async handleBoardComment(@Payload() response: any) {
    if (response.type === TypeEnum.BOARD_COMMENT_CREATE) {
      const { payload } = response as KafkaMessageDto<BoardEtcPayload>;
      console.log('댓글 생성', payload.boardId);

      const postCreatedAt = new Date(payload.boardCreatedAt);

      //1. 댓글 카운트 + 1 해야되니 db 체크 및 update

      const posts = await this.postsService.checkAndAddCommentCountById(
        payload.boardId,
      );

      //2. 7일 이내 게시글이면 redis score UP!
      if (isWithinLastWeek(postCreatedAt)) {
        const isExist = await this.redisService.isExistMember(
          getRedisKey(postCreatedAt),
          payload.boardId,
        );
        if (!isExist) {
          await this.redisService.syncData(getRedisKey(postCreatedAt), posts!);
          return;
        }

        await this.redisService.setCommentCreatedScore(
          getRedisKey(postCreatedAt),
          payload.boardId,
        );
        return;
      }
      return;
    }
  }
  @MessagePattern('board-like')
  async handleBoardLike(@Payload() response: any) {
    if (response.type === TypeEnum.BOARD_LIKE_CREATE) {
      const { payload } = response as KafkaMessageDto<BoardEtcPayload>;
      console.log('좋아요 추가', payload.boardId);

      const postCreatedAt = new Date(payload.boardCreatedAt);

      if (isWithinLastWeek(postCreatedAt)) {
        const isExist = await this.redisService.isExistMember(
          getRedisKey(postCreatedAt),
          payload.boardId,
        );
        if (!isExist) {
          const posts = await this.postsService.checkAndCreatePosts(
            payload.boardId,
          );
          await this.redisService.syncData(getRedisKey(postCreatedAt), posts);
        }
        await this.redisService.setLikeCreateScore(
          getRedisKey(postCreatedAt),
          payload.boardId,
        );
        return;
      }
      await this.postsService.checkAndCreatePosts(payload.boardId);
      return;
    }
    if (response.type === TypeEnum.BOARD_LIKE_REMOVE) {
      const { payload } = response as KafkaMessageDto<BoardEtcPayload>;
      console.log('좋아요 삭제', payload.boardId);

      const postCreatedAt = new Date(payload.boardCreatedAt);

      if (isWithinLastWeek(postCreatedAt)) {
        const isExist = await this.redisService.isExistMember(
          getRedisKey(postCreatedAt),
          payload.boardId,
        );
        if (!isExist) {
          const posts = await this.postsService.checkAndCreatePosts(
            payload.boardId,
          );
          await this.redisService.syncData(getRedisKey(postCreatedAt), posts);
        }
        await this.redisService.setLikeRemoveScore(
          getRedisKey(postCreatedAt),
          payload.boardId,
        );
        return;
      }

      await this.postsService.checkAndCreatePosts(payload.boardId);
      return;
    }
  }

  @Get('popular-posts')
  async getPopularPosts(@Query('d') days: string) {
    const postIds: string[] = await this.redisService.getTop10Posts(days);
    return this.postsService.getPostsByIds(postIds);
  }
  @Get('popular-posts/days')
  async getDays() {
    return await this.redisService.getDays();
  }
}

import { Controller } from '@nestjs/common';
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

@Controller('posts')
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
      await this.redisService.setPosts(payload.boardId);
    }

    return;
  }
  @MessagePattern('board-view')
  async handleBoardView(@Payload() response: any) {
    if (response.type === TypeEnum.BOARD_VIEW) {
      const { payload } = response as KafkaMessageDto<BoardEtcPayload>;
      console.log('게시글 조회', payload.boardId);

      const isExist = await this.redisService.isExistMember(payload.boardId);
      if (!isExist) {
        const posts = await this.postsService.checkAndCreatePosts(
          payload.boardId,
        );
        await this.redisService.syncData(posts);
      }
      await this.redisService.setViewScore(payload.boardId);
      return;
    }
  }
  @MessagePattern('board-comment')
  async handleBoardComment(@Payload() response: any) {
    if (response.type === TypeEnum.BOARD_COMMENT_CREATE) {
      const { payload } = response as KafkaMessageDto<BoardEtcPayload>;
      console.log('댓글 생성', payload.boardId);

      const isExist = await this.redisService.isExistMember(payload.boardId);
      if (!isExist) {
        const posts = await this.postsService.checkAndCreatePosts(
          payload.boardId,
        );
        await this.redisService.syncData(posts);
      }
      await this.redisService.setCommentCreatedScore(payload.boardId);
      return;
    }
  }
  @MessagePattern('board-like')
  async handleBoardLike(@Payload() response: any) {
    if (response.type === TypeEnum.BOARD_LIKE_CREATE) {
      const { payload } = response as KafkaMessageDto<BoardEtcPayload>;
      console.log('좋아요 추가', payload.boardId);

      const isExist = await this.redisService.isExistMember(payload.boardId);
      if (!isExist) {
        const posts = await this.postsService.checkAndCreatePosts(
          payload.boardId,
        );
        await this.redisService.syncData(posts);
      }
      await this.redisService.setLikeCreateScore(payload.boardId);
      return;
    }
    if (response.type === TypeEnum.BOARD_LIKE_REMOVE) {
      const { payload } = response as KafkaMessageDto<BoardEtcPayload>;
      console.log('좋아요 삭제', payload.boardId);

      const isExist = await this.redisService.isExistMember(payload.boardId);
      if (!isExist) {
        const posts = await this.postsService.checkAndCreatePosts(
          payload.boardId,
        );
        await this.redisService.syncData(posts);
      }
      await this.redisService.setLikeRemoveScore(payload.boardId);
      return;
    }
  }
}

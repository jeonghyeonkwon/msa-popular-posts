import { Controller } from '@nestjs/common';
import { PostsService } from './posts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BoardCreatePayload } from 'src/kafka/dtos/payload.dto';
import { TypeEnum } from 'src/kafka/dtos/type.enum';
import { KafkaMessageDto } from 'src/kafka/dtos/message.dto';
import { Posts } from './posts.entities';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @MessagePattern('board')
  async handleBoard(@Payload() response: any) {
    if (response.type === TypeEnum.BOARD_CREATE) {
      const { payload } = response as KafkaMessageDto<BoardCreatePayload>;
      const posts = new Posts(
        payload.boardId,
        payload.title,
        payload.createdAt,
      );
      this.postsService.createPosts(payload.usersId, posts);
    }

    return;
  }
  @MessagePattern('board-view')
  async handleBoardView(@Payload() response: any) {
    return;
  }
  @MessagePattern('board-comment')
  async handleBoardComment(@Payload() response: any) {
    return;
  }
  @MessagePattern('board-like')
  async handleBoardLike(@Payload() response: any) {
    return;
  }
}

import { toStringByDate } from 'src/util/custom-date';
import { Posts } from '../posts.entities';

export class RequestServiceDto {
  boardId: string;
  title: string;
  commentCount: number;
  viewCount: number;
  likeCount: number;
  usersId: string;
  createdAt: string;
}

export class PopularResponseDto {
  boardId: string;
  title: string;
  comentCount: number;
  createdAt: string;

  constructor(posts: Posts) {
    this.boardId = posts.id;
    this.title = posts.title;
    this.comentCount = posts.commentCount;
    this.createdAt = toStringByDate(posts.createdAt);
  }
}

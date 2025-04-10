import { toStringByDate, toStringByDateTime } from 'src/util/custom-date';
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
  commentCount: number;
  createdAt: string;
  username: string;
  constructor(posts: Posts) {
    this.boardId = posts.id;
    this.title = posts.title;
    this.commentCount = posts.commentCount;
    this.createdAt = toStringByDateTime(posts.createdAt);
    this.username = posts.user.username;
  }
}
export class PopularDaysDto {
  data: PopularDayDto[];
  constructor(days: string[]) {
    this.data = days.map((day) => new PopularDayDto(day, toStringByDate(day)));
  }
}
export class PopularDayDto {
  key: string;
  message: string;
  constructor(key: string, message: string) {
    this.key = key;
    this.message = message;
  }
}

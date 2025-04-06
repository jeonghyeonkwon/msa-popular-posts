import { PayloadEnum } from './type.enum';

export class AuthCreatePayload {
  usersId: string;
  username: string;
}

export class BoardCreatePayload {
  boardId: string;
  title: string;
  usersId: string;
  createdAt: string;
}

export class BoardEtcPayload {
  boardId: string;
  type?: PayloadEnum;
}

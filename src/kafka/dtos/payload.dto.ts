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

import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Users } from './users.entities';
import { TypeEnum } from 'src/kafka/dtos/type.enum';
import { KafkaMessageDto } from 'src/kafka/dtos/message.dto';
import { AuthCreatePayload } from 'src/kafka/dtos/payload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @MessagePattern('auth-users')
  async handleAuthUser(@Payload() payload: any): Promise<void> {
    if (payload.type === TypeEnum.AUTH_CREATE) {
      const data = payload as KafkaMessageDto<AuthCreatePayload>;

      const users: Users = new Users(
        data.payload.usersId,
        data.payload.username,
      );
      await this.usersService.createAuth(users);
      return;
    }
  }
}

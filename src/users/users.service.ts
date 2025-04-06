import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entities';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthCreatePayload } from 'src/kafka/dtos/payload.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly httpService: HttpService,
  ) {}

  async createAuth(users: Users) {
    await this.userRepository.save(users);
  }

  async findUsersById(usersId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: usersId,
      },
    });

    if (!user) {
      try {
        const { data } = await firstValueFrom(
          this.httpService.get<AuthCreatePayload>(
            `${process.env.AUTH_SERVICE}/api/auth/users/${usersId}`,
          ),
        );

        const createdUsers = new Users(data.usersId, data.username);
        return await this.createAuth(createdUsers);
      } catch (error) {
        console.error(error);
      }
    }

    return user;
  }
  async requestUser() {}
}

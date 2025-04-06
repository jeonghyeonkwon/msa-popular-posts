import { KafkaOptions, RedisOptions, Transport } from '@nestjs/microservices';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Users } from './users/users.entities';
import { Posts } from './posts/posts.entities';

export const KAFKA_OPTION: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'nestjs',
      brokers: [process.env.KAFKA_HOST!],
    },
    consumer: {
      groupId: 'nestjs-consumer',
    },
  },
};

export const TYPEORM_OPTION: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [Users, Posts],
  synchronize: false,
  logging: true,
};

export const REDIS_OPTION = {
  type: 'single',
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
};

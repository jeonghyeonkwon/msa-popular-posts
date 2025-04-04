import { KafkaOptions, Transport } from '@nestjs/microservices';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Users } from './users/users.entities';

export const KAFKA_OPTION: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'nestjs',
      brokers: [process.env.KAFKA_HOST || '127.0.0.1:9092'],
    },
    consumer: {
      groupId: 'nestjs-consumer',
    },
  },
};

export const TYPEORM_OPTION: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [Users],
  synchronize: true,
  logging: true,
};

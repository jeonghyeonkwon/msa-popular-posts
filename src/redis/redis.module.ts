import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { REDIS_OPTION } from 'src/constants';

@Module({
  imports: [RedisModule.forRoot(REDIS_OPTION as any)],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisPopularModule {}

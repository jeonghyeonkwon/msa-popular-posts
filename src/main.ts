import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { KAFKA_OPTION } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,OPTIONS',
    credentials: true,
  });
  app.connectMicroservice<MicroserviceOptions>({ ...KAFKA_OPTION });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 8084);
}
bootstrap();

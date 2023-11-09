import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AUTH_SERVICE, RmqService } from '@app/shared-library';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rmqMicroservice = app.get<RmqService>(RmqService);
  app.connectMicroservice<MicroserviceOptions>(rmqMicroservice.getOptions(AUTH_SERVICE));

  await app.startAllMicroservices();
}
bootstrap();

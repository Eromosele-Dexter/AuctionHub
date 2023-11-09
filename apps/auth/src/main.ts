import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AUTH_SERVICE, RmqService } from '@app/shared-library';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  console.log('Starting Auth Service');
  const rmqMicroservice = app.get<RmqService>(RmqService);
  const options = rmqMicroservice.getOptions(AUTH_SERVICE);
  console.log('Options', options);
  app.connectMicroservice<MicroserviceOptions>(rmqMicroservice.getOptions(AUTH_SERVICE));

  await app.startAllMicroservices();
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from '@app/shared-library/configs/rmqConfig';
import { RmqService } from '@app/shared-library';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const rmqMicroservice = app.get<RmqService>(RmqService);
  app.connectMicroservice<MicroserviceOptions>(rmqMicroservice.getOptions(PAYMENT_SERVICE));

  await app.startAllMicroservices();
}
bootstrap();

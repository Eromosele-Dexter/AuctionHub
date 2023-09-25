import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import {
  paymentKafkaConfig,
  paymentKafkaOptions,
} from '@app/shared-library/configs/kafkaConfig';

async function bootstrap() {
  paymentKafkaOptions.client.brokers = [
    process.env.KAFKA_BROKER_HOST + ':' + process.env.KAFKA_BROKER_PORT,
  ];
  paymentKafkaConfig.options = paymentKafkaOptions;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentModule,
    paymentKafkaConfig,
  );
  await app.listen();
}
bootstrap();

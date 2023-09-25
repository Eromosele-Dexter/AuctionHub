import { NestFactory } from '@nestjs/core';
import { BidModule } from './bid.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import {
  bidKafkaConfig,
  bidKafkaOptions,
} from '@app/shared-library/configs/kafkaConfig';

async function bootstrap() {
  bidKafkaOptions.client.brokers = [
    process.env.KAFKA_BROKER_HOST + ':' + process.env.KAFKA_BROKER_PORT,
  ];
  bidKafkaConfig.options = bidKafkaOptions;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BidModule,
    bidKafkaConfig,
  );
  await app.listen();
}
bootstrap();

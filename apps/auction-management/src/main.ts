import { NestFactory } from '@nestjs/core';
import { AuctionManagementModule } from './auction-management.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import {
  auctionManagementKafkaConfig,
  auctionManagementKafkaOptions,
} from '@app/shared-library/configs/kafkaConfig';

async function bootstrap() {
  auctionManagementKafkaOptions.client.brokers = [
    process.env.KAFKA_BROKER_HOST + ':' + process.env.KAFKA_BROKER_PORT,
  ];
  auctionManagementKafkaConfig.options = auctionManagementKafkaOptions;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuctionManagementModule,
    auctionManagementKafkaConfig,
  );

  app.listen();
}
bootstrap();

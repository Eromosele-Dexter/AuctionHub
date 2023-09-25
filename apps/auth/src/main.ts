import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import {
  authKafkaConfig,
  authKafkaOptions,
} from '@app/shared-library/configs/kafkaConfig';

async function bootstrap() {
  authKafkaOptions.client.brokers = [
    process.env.KAFKA_BROKER_HOST + ':' + process.env.KAFKA_BROKER_PORT,
  ];
  authKafkaConfig.options = authKafkaOptions;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    authKafkaConfig,
  );
  await app.listen();
}
bootstrap();

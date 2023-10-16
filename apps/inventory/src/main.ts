import { NestFactory } from '@nestjs/core';
import { InventoryModule } from './inventory.module';
import { inventoryKafkaConfig, inventoryKafkaOptions } from '@app/shared-library/configs/kafkaConfig';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  inventoryKafkaOptions.client.brokers = [process.env.KAFKA_BROKER_HOST + ':' + process.env.KAFKA_BROKER_PORT];
  inventoryKafkaConfig.options = inventoryKafkaOptions;

  console.log('inventory kafka config: ', inventoryKafkaConfig);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(InventoryModule, inventoryKafkaConfig);
  await app.listen();
}
bootstrap();

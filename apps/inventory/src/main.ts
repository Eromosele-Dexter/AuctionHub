import { NestFactory } from '@nestjs/core';
import { InventoryModule } from './inventory.module';

import { MicroserviceOptions } from '@nestjs/microservices';
import { INVENTORY_SERVICE, RmqService } from '@app/shared-library';

async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);
  const rmqMicroservice = app.get<RmqService>(RmqService);
  app.connectMicroservice<MicroserviceOptions>(rmqMicroservice.getOptions(INVENTORY_SERVICE));

  await app.startAllMicroservices();
}
bootstrap();

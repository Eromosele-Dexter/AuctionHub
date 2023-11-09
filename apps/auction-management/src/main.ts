import { NestFactory } from '@nestjs/core';
import { AuctionManagementModule } from './auction-management.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AUCTION_MANAGEMENT_SERVICE, RmqService } from '@app/shared-library';

async function bootstrap() {
  const app = await NestFactory.create(AuctionManagementModule);
  const rmqMicroservice = app.get<RmqService>(RmqService);
  app.connectMicroservice<MicroserviceOptions>(rmqMicroservice.getOptions(AUCTION_MANAGEMENT_SERVICE));

  await app.startAllMicroservices();
}
bootstrap();

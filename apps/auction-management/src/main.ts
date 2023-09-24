import { NestFactory } from '@nestjs/core';
import { AuctionManagementModule } from './auction-management.module';

async function bootstrap() {
  const app = await NestFactory.create(AuctionManagementModule);
  await app.listen(3000);
}
bootstrap();

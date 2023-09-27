import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { microservices } from '@app/shared-library/configs/kafkaConfig';
import { BidderEventController } from './controllers/bidder-event.controller';
import { SellerEventController } from './controllers/seller-event.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ClientsModule.register(microservices),
  ],
  controllers: [AppController, BidderEventController, SellerEventController],
  providers: [AppService],
})
export class AppModule {}

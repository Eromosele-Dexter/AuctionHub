import { Module } from '@nestjs/common';
import { AppController } from './controllers/app-controller/app.controller';
import { AppService } from './services/app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { microservices } from '@app/shared-library/configs/kafkaConfig';
import { BidderEventController } from './controllers/bidder-event-controller/bidder-event.controller';
import { SellerEventController } from './controllers/seller-event-controller/seller-event.controller';
import { BidderEventService } from './services/bidder-event.service';
import { SellerEventService } from './services/seller-event.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './middleware/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionSerializer } from './utils/session.serializer';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ClientsModule.register(microservices),
    PassportModule.register({
      session: true,
    }),
  ],
  controllers: [AppController, BidderEventController, SellerEventController],
  providers: [
    AppService,
    BidderEventService,
    SellerEventService,
    LocalStrategy,
    LocalAuthGuard,
    SessionSerializer,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './controllers/app-controller/app.controller';
import { AppService } from './services/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BidderEventController } from './controllers/bidder-event-controller/bidder-event.controller';
import { SellerEventController } from './controllers/seller-event-controller/seller-event.controller';
import { BidderEventService } from './services/bidder-event.service';
import { SellerEventService } from './services/seller-event.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './middleware/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionSerializer } from './utils/session.serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '@app/shared-library';
import { SessionRepository } from './sessions/session-repo/session.repository';
import {
  AUCTION_MANAGEMENT_SERVICE,
  AUTH_SERVICE,
  BID_SERVICE,
  INVENTORY_SERVICE,
  PAYMENT_SERVICE,
  RmqModule,
} from '@app/shared-library';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/api-gateway/.env',
      isGlobal: true,
    }),
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
    RmqModule.register({
      name: AUCTION_MANAGEMENT_SERVICE,
    }),
    RmqModule.register({
      name: BID_SERVICE,
    }),
    RmqModule.register({
      name: INVENTORY_SERVICE,
    }),
    RmqModule.register({
      name: PAYMENT_SERVICE,
    }),

    PassportModule.register({
      session: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_AUTH_DATABASE'),
        entities: [Session],
        synchronize: true, // Be cautious with this in production
      }),
    }),
    TypeOrmModule.forFeature([Session]),
  ],
  controllers: [AppController, BidderEventController, SellerEventController],
  providers: [
    AppService,
    BidderEventService,
    SellerEventService,
    LocalStrategy,
    LocalAuthGuard,
    SessionSerializer,
    SessionRepository,
  ],
})
export class AppModule {}

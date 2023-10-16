import { Module } from '@nestjs/common';
import { AppController } from './controllers/app-controller/app.controller';
import { AppService } from './services/app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { microservices } from './config/kafka-microservices.config';
import { BidderEventController } from './controllers/bidder-event-controller/bidder-event.controller';
import { SellerEventController } from './controllers/seller-event-controller/seller-event.controller';
import { BidderEventService } from './services/bidder-event.service';
import { SellerEventService } from './services/seller-event.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './middleware/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionSerializer } from './utils/session.serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../src/sessions/session.entity';
import { SessionRepository } from './sessions/session-repo/session.repository';

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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_AUTH_DATABASE,
      entities: [Session],
      synchronize: true,
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

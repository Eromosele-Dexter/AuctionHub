import { Module } from '@nestjs/common';
import { BidController } from './controllers/bid.controller';
import { BidService } from './services/bid.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from '@app/shared-library';
import { WatchListItem } from '@app/shared-library';
import { WatchListItemRepository } from './repositories/watch-list-item-repo/watch-list-item.repository';
import { BidRepository } from './repositories/bid-repo/bid.repository';
import { BidGateway } from './services/bid-gateway';
import { jwtModule } from './modules.config';
import { AuctionItemRepository } from 'apps/auction-management/src/repositories/auction-item-repo/auction-item.repository';
import { AuctionItem } from '@app/shared-library/entities/auction-management/auction-item.entity';
import { API_GATEWAY_SERVICE, AUCTION_MANAGEMENT_SERVICE, AUTH_SERVICE, RmqModule } from '@app/shared-library';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/bid/.env',
      isGlobal: true,
    }),
    RmqModule.register({
      name: AUCTION_MANAGEMENT_SERVICE,
    }),
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
    RmqModule.register({
      name: API_GATEWAY_SERVICE,
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
        database: configService.get<string>('POSTGRES_BID_DATABASE'),
        entities: [Bid, WatchListItem],
        synchronize: true, // Be cautious with this in production
      }),
    }),
    TypeOrmModule.forFeature([Bid, WatchListItem, AuctionItem]),
    jwtModule,
  ],
  controllers: [BidController],
  providers: [BidService, BidGateway, BidRepository, WatchListItemRepository, AuctionItemRepository],
})
export class BidModule {}

import { Module } from '@nestjs/common';
import { BidController } from './controllers/bid.controller';
import { BidService } from './services/bid.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { WatchList } from './entities/watch-list.entity';
import { WatchListItem } from './entities/watch-list-item.entity';
import { WatchListRepository } from './repositories/watch-list-repo/watch-list.repository';
import { WatchListItemRepository } from './repositories/watch-list-item-repo/watch-list-item.repository';
import { BidRepository } from './repositories/bid-repo/bid.repository';
import { BidGateway } from './services/bid-gateway';
import { jwtModule } from './modules.config';
import { AuctionItemRepository } from 'apps/auction-management/src/repositories/auction-item-repo/auction-item.repository';
import { AuctionItem } from 'apps/auction-management/src/entities/auction-item.entity';
import { AUCTION_MANAGEMENT_SERVICE, RmqModule } from '@app/shared-library';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/bid/.env',
      isGlobal: true,
    }),
    RmqModule.register({
      name: AUCTION_MANAGEMENT_SERVICE,
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
        entities: [Bid, WatchList, WatchListItem],
        synchronize: true, // Be cautious with this in production
      }),
    }),
    TypeOrmModule.forFeature([Bid, WatchList, WatchListItem, AuctionItem]),
    jwtModule,
  ],
  controllers: [BidController],
  providers: [
    BidService,
    BidGateway,
    BidRepository,
    WatchListRepository,
    WatchListItemRepository,
    AuctionItemRepository,
  ],
})
export class BidModule {}

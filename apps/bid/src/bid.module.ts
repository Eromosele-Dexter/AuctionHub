import { Module } from '@nestjs/common';
import { BidController } from './controllers/bid.controller';
import { BidService } from './services/bid.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionItem } from './entities/auction-item.entity';
import { Bid } from './entities/bid.entity';
import { WatchList } from './entities/watch-list.entity';
import { WatchListItem } from './entities/watch-list-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_BID_DATABASE,
      entities: [AuctionItem, Bid, WatchList, WatchListItem],
      synchronize: true,
    }),
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}

import { Module } from '@nestjs/common';
import { AuctionManagementController } from './controllers/auction-management.controller';
import { AuctionManagementService } from './services/auction-management.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionListing } from './entities/auction-listing.entity';
import { AuctionListingItem } from './entities/auction-listing-item.entity';
import { AuctionListingItemRepository } from './repositories/auction-listing-item-repo/auction-listing-item.repository';
import { AuctionListingRepository } from './repositories/auction-listing-repo/auction-listing.repository';
import { AuctionItemRepository } from './repositories/auction-item-repo/auction-item.repository';
import { AuctionItem } from './entities/auction-item.entity';

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
      database: process.env.POSTGRES_AUCTION_MANAGEMENT_DATABASE,
      entities: [AuctionListing, AuctionListingItem, AuctionItem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AuctionListing, AuctionListingItem, AuctionItem]),
  ],
  controllers: [AuctionManagementController],
  providers: [
    AuctionManagementService,
    AuctionListingItemRepository,
    AuctionListingRepository,
    AuctionItemRepository,
  ],
})
export class AuctionManagementModule {}

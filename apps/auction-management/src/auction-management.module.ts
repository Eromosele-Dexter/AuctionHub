import { Module } from '@nestjs/common';
import { AuctionManagementController } from './controllers/auction-management.controller';
import { AuctionManagementService } from './services/auction-management.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionItemRepository } from './repositories/auction-item-repo/auction-item.repository';
import { AuctionItem } from './entities/auction-item.entity';
import { BID_SERVICE, INVENTORY_SERVICE, RmqModule } from '@app/shared-library';
import { ListingItem } from './entities/listing-item.entity';
import { ListingItemRepository } from './repositories/listing-item-repo/listing-item.repository';

@Module({
  imports: [
    RmqModule.register({
      name: INVENTORY_SERVICE,
    }),
    RmqModule.register({
      name: BID_SERVICE,
    }),
    ConfigModule.forRoot({
      envFilePath: './apps/auction-management/.env',
      isGlobal: true,
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
        database: configService.get<string>('POSTGRES_AUCTION_MANAGEMENT_DATABASE'),
        entities: [AuctionItem, ListingItem],
        synchronize: true, // Be cautious with this in production
      }),
    }),
    TypeOrmModule.forFeature([AuctionItem, ListingItem]),
  ],
  controllers: [AuctionManagementController],
  providers: [AuctionManagementService, AuctionItemRepository, ListingItemRepository],
})
export class AuctionManagementModule {}

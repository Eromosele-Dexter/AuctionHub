import { Module } from '@nestjs/common';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionType } from '@app/shared-library';
import { ItemKeyword } from '@app/shared-library';
import { Item } from '@app/shared-library';
import { Keyword } from '@app/shared-library';
import { AuctionTypeRepository } from './repositories/auction-type-repo/auction-type.repository';
import { ItemKeywordRepository } from './repositories/item-keyword-repo/item-keyword.repository';
import { ItemRepository } from './repositories/item-repo/item.repository';
import { KeywordRepository } from './repositories/keyword-repo/keyword.repository';
import { AUCTION_MANAGEMENT_SERVICE, RmqModule } from '@app/shared-library';

@Module({
  imports: [
    RmqModule.register({
      name: AUCTION_MANAGEMENT_SERVICE,
    }),
    ConfigModule.forRoot({
      envFilePath: './apps/inventory/.env',
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
        database: configService.get<string>('POSTGRES_INVENTORY_DATABASE'),
        entities: [AuctionType, ItemKeyword, Item, Keyword],
        synchronize: true, // Be cautious with this in production
        ssl: {
          rejectUnauthorized: false, // Allows self-signed certificates (use with caution in production)
        },
      }),
    }),
    TypeOrmModule.forFeature([AuctionType, ItemKeyword, Item, Keyword]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, AuctionTypeRepository, ItemKeywordRepository, ItemRepository, KeywordRepository],
})
export class InventoryModule {}

import { Module } from '@nestjs/common';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionType } from './entities/auction-type.entity';
import { ItemKeyword } from './entities/item-keyword.entity';
import { Item } from './entities/item.entity';
import { Keyword } from './entities/keyword.entity';
import { AuctionTypeRepository } from './repositories/auction-type-repo/auction-type.repository';
import { ItemKeywordRepository } from './repositories/item-keyword-repo/item-keyword.repository';
import { ItemRepository } from './repositories/item-repo/item.repository';
import { KeywordRepository } from './repositories/keyword-repo/keyword.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUCTION_MANAGEMENT_SERVICE,
  AUCTION_MANAGEMENT_CLIENT_ID,
  AUCTION_MANAGEMENT_GROUP_ID,
} from '@app/shared-library';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUCTION_MANAGEMENT_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: AUCTION_MANAGEMENT_CLIENT_ID,
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: AUCTION_MANAGEMENT_GROUP_ID,
          },
        },
      },
    ]),
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
      database: process.env.POSTGRES_INVENTORY_DATABASE,
      entities: [AuctionType, ItemKeyword, Item, Keyword],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AuctionType, ItemKeyword, Item, Keyword]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, AuctionTypeRepository, ItemKeywordRepository, ItemRepository, KeywordRepository],
})
export class InventoryModule {}

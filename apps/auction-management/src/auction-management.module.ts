import { Module } from '@nestjs/common';
import { AuctionManagementController } from './controllers/auction-management.controller';
import { AuctionManagementService } from './services/auction-management.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionItemRepository } from './repositories/auction-item-repo/auction-item.repository';
import { AuctionItem } from './entities/auction-item.entity';
import { INVENTORY_SERVICE, RmqModule } from '@app/shared-library';

@Module({
  imports: [
    RmqModule.register({
      name: INVENTORY_SERVICE,
    }),
    ConfigModule.forRoot({
      envFilePath: './apps/auction-management/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_AUCTION_MANAGEMENT_DATABASE,
      entities: [AuctionItem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AuctionItem]),
  ],
  controllers: [AuctionManagementController],
  providers: [AuctionManagementService, AuctionItemRepository],
})
export class AuctionManagementModule {}

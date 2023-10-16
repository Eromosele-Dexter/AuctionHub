import { Module } from '@nestjs/common';
import { AuctionManagementController } from './controllers/auction-management.controller';
import { AuctionManagementService } from './services/auction-management.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionItemRepository } from './repositories/auction-item-repo/auction-item.repository';
import { AuctionItem } from './entities/auction-item.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { INVENTORY_SERVICE, INVENTORY_CLIENT_ID, INVENTORY_GROUP_ID } from '@app/shared-library';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: INVENTORY_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: INVENTORY_CLIENT_ID,
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: INVENTORY_GROUP_ID,
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

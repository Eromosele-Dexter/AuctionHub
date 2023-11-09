import { Module } from '@nestjs/common';
import { AuctionManagementController } from './controllers/auction-management.controller';
import { AuctionManagementService } from './services/auction-management.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
        entities: [AuctionItem],
        synchronize: true, // Be cautious with this in production
      }),
    }),
    TypeOrmModule.forFeature([AuctionItem]),
  ],
  controllers: [AuctionManagementController],
  providers: [AuctionManagementService, AuctionItemRepository],
})
export class AuctionManagementModule {}

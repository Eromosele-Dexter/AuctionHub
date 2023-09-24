import { Module } from '@nestjs/common';
import { AuctionManagementController } from './controllers/auction-management.controller';
import { AuctionManagementService } from './services/auction-management.service';

@Module({
  imports: [],
  controllers: [AuctionManagementController],
  providers: [AuctionManagementService],
})
export class AuctionManagementModule {}

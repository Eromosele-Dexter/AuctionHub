import { Module } from '@nestjs/common';
import { BidController } from './controllers/bid.controller';
import { BidService } from './services/bid.service';

@Module({
  imports: [],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}

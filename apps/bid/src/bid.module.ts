import { Module } from '@nestjs/common';
import { BidController } from './controllers/bid.controller';
import { BidService } from './services/bid.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}

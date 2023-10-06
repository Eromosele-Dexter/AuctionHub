import { Module } from '@nestjs/common';
import { WebsocketGatewayController } from './websocket-gateway.controller';
import { WebsocketGatewayService } from './websocket-gateway.service';
import { BidGatewayModule } from './bid-gateway/bid-gateway.module';

@Module({
  imports: [BidGatewayModule],
  controllers: [WebsocketGatewayController],
  providers: [WebsocketGatewayService],
})
export class WebsocketGatewayModule {}

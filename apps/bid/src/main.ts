import { NestFactory } from '@nestjs/core';
import { BidModule } from './bid.module';
import { WEBSOCKET_GATEWAY_PORT } from '@app/shared-library/configs/serverConfig';

import { SocketIOAdapter } from './services/socket-io-adapter';
import { BID_SERVICE, RmqService } from '@app/shared-library';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BidModule);
  const rmqMicroservice = app.get<RmqService>(RmqService);
  app.connectMicroservice<MicroserviceOptions>(rmqMicroservice.getOptions(BID_SERVICE));

  // Enable WebSocket support
  app.useWebSocketAdapter(new SocketIOAdapter(app));

  await app.startAllMicroservices();

  await app.listen(WEBSOCKET_GATEWAY_PORT);
}
bootstrap();

// Send simple message on Kafka
// Use Websocket

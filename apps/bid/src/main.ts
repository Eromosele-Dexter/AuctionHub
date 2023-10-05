import { NestFactory } from '@nestjs/core';
import { BidModule } from './bid.module';
// import { MicroserviceOptions } from '@nestjs/microservices';
import {
  bidKafkaConfig,
  bidKafkaOptions,
} from '@app/shared-library/configs/kafkaConfig';
import { WEBSOCKET_GATEWAY_PORT } from '@app/shared-library/configs/serverConfig';

import { SocketIOAdapter } from './services/socket-io-adapter';

async function bootstrap() {
  bidKafkaOptions.client.brokers = [
    process.env.KAFKA_BROKER_HOST + ':' + process.env.KAFKA_BROKER_PORT,
  ];
  bidKafkaConfig.options = bidKafkaOptions;

  const app = await NestFactory.create(BidModule);

  app.connectMicroservice(bidKafkaConfig);

  // Enable WebSocket support
  app.useWebSocketAdapter(new SocketIOAdapter(app));

  await app.startAllMicroservices();

  await app.listen(WEBSOCKET_GATEWAY_PORT);
}
bootstrap();

// Send simple message on Kafka
// Use Websocket

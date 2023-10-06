import { NestFactory } from '@nestjs/core';
import { WebsocketGatewayModule } from './websocket-gateway.module';
import { WEBSOCKET_GATEWAY_PORT } from '@app/shared-library/configs/serverConfig';

async function bootstrap() {
  const app = await NestFactory.create(WebsocketGatewayModule);
  await app.listen(WEBSOCKET_GATEWAY_PORT);
}
bootstrap();

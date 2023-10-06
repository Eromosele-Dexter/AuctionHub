import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { API_GATEWAY_PORT } from '@app/shared-library/configs/serverConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api-gateway');

  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());

  const logger = new Logger();

  const config = new DocumentBuilder()
    .setTitle('Auction Hub')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('auction-hub')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();

  await app.listen(API_GATEWAY_PORT);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

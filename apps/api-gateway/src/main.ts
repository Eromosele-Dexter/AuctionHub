import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { API_GATEWAY_PORT } from '@app/shared-library/configs/serverConfig';
import * as session from 'express-session';
import * as passport from 'passport';
import { rateLimiter } from './middleware/rate-limiter.middleware';
import { TypeormStore } from 'connect-typeorm';
import { SessionRepository } from './sessions/session-repo/session.repository';
import { API_GATEWAY_SERVICE } from '@app/shared-library/configs/rmqConfig';
import { RmqService } from '@app/shared-library';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const SessionRepo = app.get(SessionRepository);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api-gateway');

  app.use(rateLimiter);

  const COOKIE_EXPIRY = 3_600_000; // 1 hour

  app.use(
    session({
      name: 'bid_session_id',
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: COOKIE_EXPIRY,
        secure: true, // Set to true if using HTTPS, false otherwise
        httpOnly: true,
        sameSite: 'none', // or 'strict' based on your requirements
      },
      store: new TypeormStore({}).connect(SessionRepo),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
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

  const rmqMicroservice = app.get<RmqService>(RmqService);

  app.connectMicroservice<MicroserviceOptions>(rmqMicroservice.getOptions(API_GATEWAY_SERVICE));

  await app.startAllMicroservices();

  await app.listen(API_GATEWAY_PORT);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

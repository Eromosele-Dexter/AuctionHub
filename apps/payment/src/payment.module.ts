import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '@app/shared-library';
import { PaymentRepository } from './repositories/payment-repo/payment.repository';
import { AUCTION_MANAGEMENT_SERVICE, AUTH_SERVICE, RmqModule } from '@app/shared-library';
import { SendGridService } from './services/sendgrid.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/payment/.env',
      isGlobal: true,
    }),
    RmqModule.register({
      name: AUCTION_MANAGEMENT_SERVICE,
    }),
    RmqModule.register({
      name: AUTH_SERVICE,
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
        database: configService.get<string>('POSTGRES_PAYMENT_DATABASE'),
        entities: [Payment],
        synchronize: true, // Be cautious with this in production
      }),
    }),
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository, SendGridService],
})
export class PaymentModule {}

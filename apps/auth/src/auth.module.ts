import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/shared-library';
import { UserRepository } from './repositories/user-repo/user.repository';
import { ValidationCode } from '@app/shared-library';
import { ValidationCodeRepository } from './repositories/validation-codes-repo/code.repository';
import { SendGridService } from './services/sendgrid.service';
import { RmqModule } from '@app/shared-library';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/auth/.env',
      isGlobal: true,
    }),
    RmqModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_AUTH_DATABASE'),
        entities: [User, ValidationCode],
        synchronize: true, // Be cautious with this in production
      }),
    }),
    TypeOrmModule.forFeature([User, ValidationCode]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, ValidationCodeRepository, SendGridService],
})
export class AuthModule {}

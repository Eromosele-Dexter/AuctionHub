import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user-repo/user.repository';
import { ValidationCode } from './entities/validation-code.entity';
import { ValidationCodeRepository } from './repositories/validation-codes-repo/code.repository';
import { SendGridService } from './services/sendgrid.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_AUTH_DATABASE,
      entities: [User, ValidationCode],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, ValidationCode]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, ValidationCodeRepository, SendGridService],
})
export class AuthModule {}

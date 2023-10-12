import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { REGISTER_USER_MESSAGE_PATTERN, LOGIN_USER_MESSAGE_PATTERN } from '@app/shared-library';
import RegisterUserEvent from '@app/shared-library/events/register-user.event';

import LoginUserEvent from '@app/shared-library/events/login-user';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @MessagePattern(REGISTER_USER_MESSAGE_PATTERN)
  handleRegisterUser(data: RegisterUserEvent) {
    return this.authService.handleRegisterUser(data);
  }

  @MessagePattern(LOGIN_USER_MESSAGE_PATTERN)
  handleLoginUser(data: LoginUserEvent) {
    return this.authService.handleLoginUser(data);
  }
}

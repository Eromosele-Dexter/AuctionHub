import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { REGISTER_USER_MESSAGE_PATTERN, LOGIN_USER_MESSAGE_PATTERN } from '@app/shared-library';
import RegisterUserMessage from '@app/shared-library/messages/register-user.message';
import LoginUserMessage from '@app/shared-library/messages/login-user.message';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @MessagePattern(REGISTER_USER_MESSAGE_PATTERN)
  handleRegisterUser(data: RegisterUserMessage) {
    return this.authService.handleRegisterUser(data);
  }

  @MessagePattern(LOGIN_USER_MESSAGE_PATTERN)
  handleLoginUser(data: LoginUserMessage) {
    return this.authService.validateUser(data.username, data.password);
  }
}

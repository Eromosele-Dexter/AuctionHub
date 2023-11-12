import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  REGISTER_USER_MESSAGE_PATTERN,
  LOGIN_USER_MESSAGE_PATTERN,
  SEND_VALIDATION_CODE_EVENT_PATTERN,
  RESET_PASSWORD_MESSAGE_PATTERN,
  EDIT_PROFILE_MESSAGE_PATTERN,
  RmqService,
} from '@app/shared-library';
import SendValidationCodeEvent from '@app/shared-library/events/send-validation-code.event';
import LoginUserMessage from '@app/shared-library/messages/login-user.message';
import RegisterUserMessage from '@app/shared-library/messages/register-user.message';
import ResetPasswordMessage from '@app/shared-library/messages/reset-password.message';
import EditProfileMessage from '@app/shared-library/messages/edit-profile.message';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(REGISTER_USER_MESSAGE_PATTERN)
  handleRegisterUser(@Payload() data: RegisterUserMessage, @Ctx() context: RmqContext) {
    const registerUserResponse = this.authService.handleRegisterUser(data);
    this.rmqService.ack(context);
    return registerUserResponse;
  }

  @MessagePattern(LOGIN_USER_MESSAGE_PATTERN)
  handleLoginUser(@Payload() data: LoginUserMessage, @Ctx() context: RmqContext) {
    const loginUserResponse = this.authService.validateUser(data.username, data.password);
    this.rmqService.ack(context);
    return loginUserResponse;
  }

  @EventPattern(SEND_VALIDATION_CODE_EVENT_PATTERN)
  handleSendValidationCode(@Payload() data: SendValidationCodeEvent, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.authService.handleSendValidationCode(data);
  }

  @MessagePattern(RESET_PASSWORD_MESSAGE_PATTERN)
  handleResetPassword(@Payload() data: ResetPasswordMessage, @Ctx() context: RmqContext) {
    const resetPasswordResponse = this.authService.handleResetPassword(data);
    this.rmqService.ack(context);
    return resetPasswordResponse;
  }

  @MessagePattern(EDIT_PROFILE_MESSAGE_PATTERN)
  handleEditProfile(@Payload() data: EditProfileMessage, @Ctx() context: RmqContext) {
    const editProfileResponse = this.authService.handleEditProfile(data);
    this.rmqService.ack(context);
    return editProfileResponse;
  }
}

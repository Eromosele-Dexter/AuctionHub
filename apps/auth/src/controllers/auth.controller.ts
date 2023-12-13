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
  GET_USERS_MESSAGE_PATTERN,
  GET_SINGLE_USER_MESSAGE_PATTERN,
} from '@app/shared-library';
import SendValidationCodeEvent from '@app/shared-library/events/send-validation-code.event';
import LoginUserMessage from '@app/shared-library/messages/login-user.message';
import RegisterUserMessage from '@app/shared-library/messages/register-user.message';
import ResetPasswordMessage from '@app/shared-library/messages/reset-password.message';
import EditProfileMessage from '@app/shared-library/messages/edit-profile.message';
import GetUsersMessage from '@app/shared-library/messages/get-users.message';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(REGISTER_USER_MESSAGE_PATTERN)
  async handleRegisterUser(@Payload() data: RegisterUserMessage, @Ctx() context: RmqContext) {
    console.log('register endpoint hit in auth controller');
    const registerUserResponse = await this.authService.handleRegisterUser(data);
    this.rmqService.ack(context);
    console.log('acknowledged');
    return registerUserResponse;
  }

  @MessagePattern(LOGIN_USER_MESSAGE_PATTERN)
  async handleLoginUser(@Payload() data: LoginUserMessage, @Ctx() context: RmqContext) {
    const loginUserResponse = await this.authService.validateUser(data.username, data.password);
    this.rmqService.ack(context);
    return loginUserResponse;
  }

  @EventPattern(SEND_VALIDATION_CODE_EVENT_PATTERN)
  handleSendValidationCode(@Payload() data: SendValidationCodeEvent, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.authService.handleSendValidationCode(data);
  }

  @MessagePattern(RESET_PASSWORD_MESSAGE_PATTERN)
  async handleResetPassword(@Payload() data: ResetPasswordMessage, @Ctx() context: RmqContext) {
    const resetPasswordResponse = await this.authService.handleResetPassword(data);
    this.rmqService.ack(context);
    return resetPasswordResponse;
  }

  @MessagePattern(EDIT_PROFILE_MESSAGE_PATTERN)
  async handleEditProfile(@Payload() data: EditProfileMessage, @Ctx() context: RmqContext) {
    const editProfileResponse = await this.authService.handleEditProfile(data);
    this.rmqService.ack(context);
    return editProfileResponse;
  }

  @MessagePattern(GET_USERS_MESSAGE_PATTERN)
  async handleGetUsers(@Payload() data: GetUsersMessage, @Ctx() context: RmqContext) {
    const users = await this.authService.handleGetUsersByIds(data);
    this.rmqService.ack(context);
    return users;
  }

  @MessagePattern(GET_SINGLE_USER_MESSAGE_PATTERN)
  async handleGetSingleUser(@Payload() user_id: number, @Ctx() context: RmqContext) {
    const user = await this.authService.handleGetSingleUser(user_id);
    this.rmqService.ack(context);
    return user;
  }
}

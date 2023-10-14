import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  AUCTION_MANAGEMENT_SERVICE,
  AUTH_SERVICE,
  BID_SERVICE,
  INVENTORY_SERVICE,
  LOGIN_USER_MESSAGE_PATTERN,
  PAYMENT_SERVICE,
  REGISTER_USER_MESSAGE_PATTERN,
  RESET_PASSWORD_MESSAGE_PATTERN,
  ResetPasswordResponse,
  SEND_VALIDATION_CODE_EVENT_PATTERN,
} from '@app/shared-library';

import {
  RegisterUserRequest,
  LoginUserRequest,
  SendValidationCodeRequest,
  ResetPasswordRequest,
} from '@app/shared-library';

import { RegisterUserResponse, LoginUserResponse } from '@app/shared-library';
import RegisterUserMessage from '@app/shared-library/messages/register-user.message';
import LoginUserMessage from '@app/shared-library/messages/login-user.message';
import SendValidationCodeEvent from '@app/shared-library/events/send-validation-code.event';
import ResetPasswordMessage from '@app/shared-library/messages/reset-password.message';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientKafka,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientKafka,
    @Inject(BID_SERVICE) private readonly bidClient: ClientKafka,
    @Inject(INVENTORY_SERVICE) private readonly inventoryClient: ClientKafka,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf(REGISTER_USER_MESSAGE_PATTERN);
    this.authClient.subscribeToResponseOf(LOGIN_USER_MESSAGE_PATTERN);
    this.authClient.subscribeToResponseOf(RESET_PASSWORD_MESSAGE_PATTERN);
    await this.authClient.connect();
  }

  async registerUser(registerUserRequest: RegisterUserRequest): Promise<RegisterUserResponse> {
    const response = new Promise<RegisterUserResponse>((resolve, reject) => {
      this.authClient
        .send(
          REGISTER_USER_MESSAGE_PATTERN,
          new RegisterUserMessage(
            registerUserRequest.firstName,
            registerUserRequest.lastName,
            registerUserRequest.username,
            registerUserRequest.password,
            registerUserRequest.email,
            registerUserRequest.streetName,
            registerUserRequest.streetNumber,
            registerUserRequest.country,
            registerUserRequest.city,
            registerUserRequest.postalCode,
            registerUserRequest.isSeller,
            new Date(),
          ),
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
    });

    return response;
  }

  async validateUser(loginUserRequest: LoginUserRequest): Promise<LoginUserResponse> {
    const validatedUserResponse = new Promise<LoginUserResponse>((resolve, reject) => {
      this.authClient
        .send(
          LOGIN_USER_MESSAGE_PATTERN,
          new LoginUserMessage(loginUserRequest.username, loginUserRequest.password),
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
    });

    return validatedUserResponse;
  }

  sendValidationCode(sendValidationCodeRequest: SendValidationCodeRequest) {
    this.authClient.emit(
      SEND_VALIDATION_CODE_EVENT_PATTERN,
      new SendValidationCodeEvent(sendValidationCodeRequest.email),
    );
  }

  async resetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = new Promise<ResetPasswordResponse>((resolve, reject) => {
      this.authClient
        .send(
          RESET_PASSWORD_MESSAGE_PATTERN,
          new ResetPasswordMessage(
            resetPasswordRequest.email,
            resetPasswordRequest.code,
            resetPasswordRequest.newPassword,
          ),
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
    });

    return response;
  }

  async viewCatalog() {
    throw new Error('Method not implemented.');
  }

  async searchCatalog() {
    throw new Error('Method not implemented.');
  }

  async viewBiddingHistory() {
    throw new Error('Method not implemented.');
  }

  async editProfile() {
    throw new Error('Method not implemented.');
  }

  async viewItem() {
    throw new Error('Method not implemented.');
  }

  async auctionEnded() {
    throw new Error('Method not implemented.');
  }
}

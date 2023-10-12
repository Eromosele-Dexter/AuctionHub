import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { RegisterUserRequest } from '../api-contracts/auth/requests/register-user.request';
import { ClientKafka } from '@nestjs/microservices';
import {
  AUCTION_MANAGEMENT_SERVICE,
  AUTH_SERVICE,
  BID_SERVICE,
  INVENTORY_SERVICE,
  LOGIN_USER_MESSAGE_PATTERN,
  PAYMENT_SERVICE,
  REGISTER_USER_MESSAGE_PATTERN,
} from '@app/shared-library';
import RegisterUserEvent from '@app/shared-library/events/register-user.event';
import { RegisterUserResponse } from '../api-contracts/auth/responses/register-user.response';
import { LoginUserResponse } from '../api-contracts/auth/responses/login-user.response';
import { LoginUserRequest } from '../api-contracts/auth/requests/login-user.request';
import LoginUserEvent from '@app/shared-library/events/login-user';

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
    await this.authClient.connect();
  }

  async registerUser(registerUserRequest: RegisterUserRequest): Promise<RegisterUserResponse> {
    return new Promise<RegisterUserResponse>((resolve, reject) => {
      this.authClient
        .send(
          REGISTER_USER_MESSAGE_PATTERN,
          new RegisterUserEvent(
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
            resolve(response.token);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  async validateUser(loginUserRequest: LoginUserRequest): Promise<any> {
    const user = new Promise<LoginUserResponse>((resolve, reject) => {
      this.authClient
        .send(LOGIN_USER_MESSAGE_PATTERN, new LoginUserEvent(loginUserRequest.username, loginUserRequest.password))
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
    });

    return user;
  }

  async logoutUser() {
    throw new Error('Method not implemented.');
  }

  async resetPassword() {
    throw new Error('Method not implemented.');
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

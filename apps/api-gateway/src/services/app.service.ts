import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { RegisterUserRequest } from '../api-contracts/auth/requests/register-user.request';
import { ClientKafka } from '@nestjs/microservices';
import {
  AUCTION_MANAGEMENT_SERVICE,
  AUTH_SERVICE,
  BID_SERVICE,
  INVENTORY_SERVICE,
  PAYMENT_SERVICE,
  REGISTER_USER_MESSAGE_PATTERN,
} from '@app/shared-library';
import RegisterUserEvent from '@app/shared-library/events/register-user.event';
import { RegisterUserResponse } from '../api-contracts/auth/responses/register-user.response';

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
}

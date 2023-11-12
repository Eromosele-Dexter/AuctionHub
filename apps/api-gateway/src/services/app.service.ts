import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUCTION_MANAGEMENT_SERVICE,
  AUTH_SERVICE,
  BID_SERVICE,
  EDIT_PROFILE_MESSAGE_PATTERN,
  INVENTORY_SERVICE,
  LOGIN_USER_MESSAGE_PATTERN,
  PAYMENT_SERVICE,
  REGISTER_USER_MESSAGE_PATTERN,
  RESET_PASSWORD_MESSAGE_PATTERN,
  ResetPasswordResponse,
  SEARCH_CATALOG_MESSAGE_PATTERN,
  SEND_VALIDATION_CODE_EVENT_PATTERN,
  VIEW_CATALOG_MESSAGE_PATTERN,
  VIEW_LISTING_MESSAGE_PATTERN,
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
import { ViewCatalogResponse } from '@app/shared-library/api-contracts/auction-management/responses/view-catalog.response';
import ViewCatalogMessage from '@app/shared-library/messages/view-catalog.message';
import { SearchCatalogResponse } from '@app/shared-library/api-contracts/auction-management/responses/search-catalog.response';
import SearchCatalogMessage from '@app/shared-library/messages/search-catalog.message';
import { EditProfileRequest } from '@app/shared-library/api-contracts/auth/requests/edit-profile.request';
import { EditProfileResponse } from '@app/shared-library/api-contracts/auth/responses/edit-profile.response';
import EditProfileMessage from '@app/shared-library/messages/edit-profile.message';

@Injectable()
export class AppService {
  constructor(
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(BID_SERVICE) private readonly bidClient: ClientProxy,
    @Inject(INVENTORY_SERVICE) private readonly inventoryClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
  ) {}

  async registerUser(registerUserRequest: RegisterUserRequest): Promise<RegisterUserResponse> {
    console.log(this.authClient);
    const response = await new Promise<RegisterUserResponse>((resolve, reject) => {
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

  async viewCatalog(userId: number): Promise<ViewCatalogResponse> {
    const response = new Promise<ViewCatalogResponse>((resolve, reject) => {
      this.auctionManagementClient.send(VIEW_CATALOG_MESSAGE_PATTERN, new ViewCatalogMessage(userId)).subscribe({
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

  async searchCatalog(searchkeyword: string): Promise<SearchCatalogResponse> {
    const response = new Promise<SearchCatalogResponse>((resolve, reject) => {
      this.auctionManagementClient
        .send(SEARCH_CATALOG_MESSAGE_PATTERN, new SearchCatalogMessage(searchkeyword))
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

  async viewBiddingHistory() {
    throw new Error('Method not implemented.');
  }

  async editProfile(userId: number, editProfileRequest: EditProfileRequest): Promise<EditProfileResponse> {
    const response = new Promise<EditProfileResponse>((resolve, reject) => {
      this.authClient
        .send(
          EDIT_PROFILE_MESSAGE_PATTERN,
          new EditProfileMessage(
            userId,
            editProfileRequest.firstName,
            editProfileRequest.lastName,
            editProfileRequest.username,
            editProfileRequest.email,
            editProfileRequest.streetName,
            editProfileRequest.streetNumber,
            editProfileRequest.postalCode,
            editProfileRequest.city,
            editProfileRequest.country,
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

  // async viewItem() {
  //   throw new Error('Method not implemented.');
  // }

  // async auctionEnded() {
  //   throw new Error('Method not implemented.');
  // }
}

import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment-repo/payment.repository';
import CheckOutItemMessage from '@app/shared-library/messages/check-out-item.message';
import {
  AUCTION_MANAGEMENT_SERVICE,
  AUTH_SERVICE,
  GET_LISTING_ITEM_BY_ID_MESSAGE_PATTERN,
  GET_SINGLE_USER_MESSAGE_PATTERN,
  SELL_AUCITON_ITEM_MESSAGE_PATTERN,
} from '@app/shared-library';
import { ClientProxy } from '@nestjs/microservices';
import { CheckOutItemResponse } from '@app/shared-library/api-contracts/payment/responses/check-out.response';
import { GetSingleUserResponse } from '@app/shared-library/api-contracts/auth/responses/get-single-user.response';
import { GetListingItemByIdResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-listing-item-by-id.response';
import GetListingItemMessage from '@app/shared-library/messages/get-listing-item.message';
import GetListingItemByIdMessage from '@app/shared-library/messages/get-listing-item-by-id.message';
import { CheckOutItem } from '@app/shared-library/types/check-out-item';
import SellAuctionItemMessage from '@app/shared-library/messages/sell-auction-item.message';
import { SellAuctionItemResponse } from '@app/shared-library/api-contracts/auction-management/responses/sell-auction-item.response';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  async handleCheckoutItem(data: CheckOutItemMessage): Promise<CheckOutItemResponse> {
    const { user_id, listing_item_id } = data;

    // get user from user_id

    const user = (
      await new Promise<GetSingleUserResponse>((resolve, reject) => {
        this.authClient.send(GET_SINGLE_USER_MESSAGE_PATTERN, user_id).subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
      })
    ).data;

    if (!user) {
      return new CheckOutItemResponse(null, 'Checkout item unsuccessful', 'failed');
    }

    // get listing item from listing_item_id

    await new Promise<SellAuctionItemResponse>((resolve, reject) => {
      this.auctionManagementClient
        .send(SELL_AUCITON_ITEM_MESSAGE_PATTERN, new SellAuctionItemMessage(listing_item_id))
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
    });

    // create payment TOOD: get shipping fee and amount from CheckOutItemMessag
    await this.paymentRepository.createPayment(new Payment(user_id, 0, 0, new Date().getTime(), listing_item_id));

    return new CheckOutItemResponse(null, 'Checkout item successful', 'success');
  }
}

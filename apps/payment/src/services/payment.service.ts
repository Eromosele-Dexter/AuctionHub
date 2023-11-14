import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment-repo/payment.repository';
import CheckOutItemMessage from '@app/shared-library/messages/check-out-item.message';
import {
  AUCTION_MANAGEMENT_SERVICE,
  AUTH_SERVICE,
  GET_LISTING_ITEM_BY_ID_MESSAGE_PATTERN,
  GET_SINGLE_USER_MESSAGE_PATTERN,
} from '@app/shared-library';
import { ClientProxy } from '@nestjs/microservices';
import { CheckOutItemResponse } from '@app/shared-library/api-contracts/payment/responses/check-out.response';
import { GetSingleUserResponse } from '@app/shared-library/api-contracts/auth/responses/get-single-user.response';
import { GetListingItemByIdResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-listing-item-by-id.response';
import GetListingItemMessage from '@app/shared-library/messages/get-listing-item.message';
import GetListingItemByIdMessage from '@app/shared-library/messages/get-listing-item-by-id.message';
import { CheckOutItem } from '@app/shared-library/types/check-out-item';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  async handleCheckoutItem(data: CheckOutItemMessage): Promise<CheckOutItemResponse> {
    const { user_id, listing_item_id, bid_amount } = data;

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

    // get listing item from listing_item_id

    const listingItem = (
      await new Promise<GetListingItemByIdResponse>((resolve, reject) => {
        this.auctionManagementClient
          .send(GET_LISTING_ITEM_BY_ID_MESSAGE_PATTERN, new GetListingItemByIdMessage(listing_item_id))
          .subscribe({
            next: (response) => {
              resolve(response);
            },
            error: (error) => {
              reject(error);
            },
          });
      })
    ).data;

    const checkoutItem = new CheckOutItem(
      user.first_name,
      user.last_name,
      user.street_name,
      user.street_number,
      user.city,
      user.postal_code,
      bid_amount,
      0.05 * bid_amount, // shipping cost is 5% of bid amount
      listing_item_id,
      listingItem.name,
    );

    return new CheckOutItemResponse(checkoutItem, 'Checkout item successful', 'success');
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment-repo/payment.repository';
import CheckOutItemMessage from '@app/shared-library/messages/check-out-item.message';
import {
  AUCTION_MANAGEMENT_SERVICE,
  AUTH_SERVICE,
  GET_SINGLE_USER_MESSAGE_PATTERN,
  SELL_AUCITON_ITEM_MESSAGE_PATTERN,
} from '@app/shared-library';
import { ClientProxy } from '@nestjs/microservices';
import { CheckOutItemResponse } from '@app/shared-library/api-contracts/payment/responses/check-out.response';
import { GetSingleUserResponse } from '@app/shared-library/api-contracts/auth/responses/get-single-user.response';
import SellAuctionItemMessage from '@app/shared-library/messages/sell-auction-item.message';
import { SellAuctionItemResponse } from '@app/shared-library/api-contracts/auction-management/responses/sell-auction-item.response';
import { Payment } from '@app/shared-library';
import { SendGridService } from './sendgrid.service';
import { AUCTION_WON_EMAIL_SUBJECT, auctionWonEmailFormat } from '../utils/emailformats';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private sendGridService: SendGridService,
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

    const listingItem = (
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
      })
    ).data;

    // create payment TOOD: get shipping fee and amount from CheckOutItemMessag
    await this.paymentRepository.createPayment(new Payment(user_id, 0, 0, new Date().getTime(), listing_item_id));

    const itemName = listingItem.name;

    const formattedItemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

    this.sendGridService.sendEmail(
      user.email,
      AUCTION_WON_EMAIL_SUBJECT,
      auctionWonEmailFormat(user.username, formattedItemName),
      auctionWonEmailFormat(user.username, formattedItemName, true),
    );

    return new CheckOutItemResponse(null, 'Checkout item successful', 'success');
  }
}

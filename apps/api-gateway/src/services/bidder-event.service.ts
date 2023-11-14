import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  BID_SERVICE,
  CHECK_OUT_ITEM_MESSAGE_PATTERN,
  GET_BID_HISTORY_MESSAGE_PATTERN,
  PAYMENT_SERVICE,
  VIEW_WATCH_LIST_MESSAGE_PATTERN,
} from '@app/shared-library';
import { SessionRepository } from '../sessions/session-repo/session.repository';
import { RetrieveSessionResponse } from '@app/shared-library/api-contracts/api-gateway/responses/retrieve-cookie.response';
import { UpdateHasActiveBidRequest } from '@app/shared-library/api-contracts/api-gateway/requests/update-has-active-bid.request';
import { ViewBiddingHistoryResponse } from '@app/shared-library/api-contracts/bid/responses/get-bidding-history-for-item.response';
import ViewBiddingHistoryMessage from '@app/shared-library/messages/get-bidding-history.message';
import { ViewWatchListResponse } from '@app/shared-library/api-contracts/bid/responses/view-watchlist.response';
import ViewWatchListMessage from '@app/shared-library/messages/view-watch-list.message';
import { CheckoutRequest } from '@app/shared-library/api-contracts/payment/requests/check-out.request';
import { CheckOutItemResponse } from '@app/shared-library/api-contracts/payment/responses/check-out.response';
import CheckOutItemMessage from '@app/shared-library/messages/check-out-item.message';

@Injectable()
export class BidderEventService {
  constructor(
    @Inject(BID_SERVICE) private readonly bidClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
    private sessionRepository: SessionRepository,
  ) {}

  async handleRetrieveSession(bidSessionId: string): Promise<RetrieveSessionResponse> {
    const session = await this.sessionRepository.getSessionById(bidSessionId);

    if (!session) {
      return new RetrieveSessionResponse(null, 'Session not found', 'error', "Session doesn't exist");
    }

    return new RetrieveSessionResponse(session, 'Session retrieved successfully', 'success');
  }

  async updateHasActiveBid(
    updateHasActiveBidRequest: UpdateHasActiveBidRequest,
    bidSessionId: string,
  ): Promise<any> {
    const { listing_item_id } = updateHasActiveBidRequest;

    //sets has_active_bid to true and update listing_item_id in session
    await this.sessionRepository.updateSessionHasActiveBid(bidSessionId, true, listing_item_id);

    return true;
  }

  async handleViewBiddingHistory(listing_item_id: number): Promise<ViewBiddingHistoryResponse> {
    const response = await new Promise<ViewBiddingHistoryResponse>((resolve, reject) => {
      this.bidClient
        .send(GET_BID_HISTORY_MESSAGE_PATTERN, new ViewBiddingHistoryMessage(listing_item_id))
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

  async handleViewWatchList(userId: number): Promise<ViewWatchListResponse> {
    const response = await new Promise<ViewWatchListResponse>((resolve, reject) => {
      this.bidClient.send(VIEW_WATCH_LIST_MESSAGE_PATTERN, new ViewWatchListMessage(userId)).subscribe({
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

  async checkout(user_id: number, checkoutRequest: CheckoutRequest): Promise<CheckOutItemResponse> {
    const response = await new Promise<CheckOutItemResponse>((resolve, reject) => {
      this.paymentClient
        .send(
          CHECK_OUT_ITEM_MESSAGE_PATTERN,
          new CheckOutItemMessage(checkoutRequest.listing_item_id, user_id, checkoutRequest.bid_amount),
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
}

import { Inject, Injectable } from '@nestjs/common';
import { BidRepository } from '../repositories/bid-repo/bid.repository';
import { WatchListItemRepository } from '../repositories/watch-list-item-repo/watch-list-item.repository';
import {
  AUCTION_MANAGEMENT_SERVICE,
  GET_AUCTION_ITEM_MESSAGE_PATTERN,
  PLACE_DUTCH_BID_AUCTION_MESSAGE_PATTERN,
  PLACE_FORWARD_BID_AUCTION_MESSAGE_PATTERN,
} from '@app/shared-library';
import { ClientProxy } from '@nestjs/microservices';
import { PlaceBidRequest } from '@app/shared-library/api-contracts/bid/requests/place-bid.request';
import { GetAuctionItemResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-auction-item.response';
import GetAuctionItemMessage from '@app/shared-library/messages/get-auction-item.message';
import { PlaceBidResponse } from '@app/shared-library/api-contracts/auction-management/responses/place-bid.response';
import PlaceForwardBidMessage from '@app/shared-library/messages/place-forward-bid.message';
import PlaceDutchBidMessage from '@app/shared-library/messages/place-dutch-bid.message';

@Injectable()
export class BidService {
  constructor(
    private bidRepository: BidRepository,
    private watchListItemRepository: WatchListItemRepository,
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientProxy,
  ) {}

  async handlePlaceBid(data: PlaceBidRequest) {
    const { listing_item_id, bidder_id, bid_amount } = data;

    const itemResponse = await new Promise<GetAuctionItemResponse>((resolve, reject) => {
      this.auctionManagementClient
        .send(GET_AUCTION_ITEM_MESSAGE_PATTERN, new GetAuctionItemMessage(listing_item_id))
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
    });

    const item = itemResponse.data;

    if (!item || new Date().getTime() >= item.end_time || item.has_been_sold) {
      throw new Error('Auction for this item has ended or does not exist.');
    }

    if (item.decrement_amount === -1) {
      return this.handleForwardAuction(bidder_id, bid_amount, itemResponse);
    } else {
      return this.handleDutchAuction(bidder_id, itemResponse);
    }
  }

  private async handleForwardAuction(
    bidder_id: number,
    bid_amount: number,
    itemResponse: GetAuctionItemResponse,
  ): Promise<PlaceBidResponse> {
    const item = itemResponse.data;

    if (bid_amount <= item.current_bid_price) {
      throw new Error('Bid must be higher than the current bid.');
    }

    const updatedAuctionItem = await new Promise<PlaceBidResponse>((resolve, reject) => {
      this.auctionManagementClient
        .send(
          PLACE_FORWARD_BID_AUCTION_MESSAGE_PATTERN,
          new PlaceForwardBidMessage(bidder_id, item.listing_item_id, item.id, bid_amount),
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

    return updatedAuctionItem;
  }

  private async handleDutchAuction(
    bidder_id: number,
    itemResponse: GetAuctionItemResponse,
  ): Promise<PlaceBidResponse> {
    const item = itemResponse.data;

    const reservePrice = 0.1 * item.starting_bid_price; // reserve price is 10% of starting bid price

    if (item.current_bid_price < reservePrice) {
      throw new Error('Bid must be higher than the reserve price.');
    }

    const updatedAuctionItem = await new Promise<PlaceBidResponse>((resolve, reject) => {
      this.auctionManagementClient
        .send(
          PLACE_DUTCH_BID_AUCTION_MESSAGE_PATTERN,
          new PlaceDutchBidMessage(bidder_id, item.listing_item_id, item.id),
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

    return updatedAuctionItem;
  }
}

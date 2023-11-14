import { Inject, Injectable } from '@nestjs/common';
import { BidRepository } from '../repositories/bid-repo/bid.repository';
import { WatchListItemRepository } from '../repositories/watch-list-item-repo/watch-list-item.repository';
import {
  API_GATEWAY_PORT,
  AUCTION_MANAGEMENT_SERVICE,
  AUTH_SERVICE,
  GET_AUCTION_ITEMS_BY_LISTING_ITEM_IDS_MESSAGE_PATTERN,
  GET_AUCTION_ITEM_MESSAGE_PATTERN,
  GET_USERS_MESSAGE_PATTERN,
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
import axios from 'axios';
import { Bid } from '../entities/bid.entity';
import ViewBiddingHistoryMessage from '@app/shared-library/messages/get-bidding-history.message';
import ViewWatchListMessage from '@app/shared-library/messages/view-watch-list.message';
import { ViewBiddingHistoryResponse } from '@app/shared-library/api-contracts/bid/responses/get-bidding-history-for-item.response';
import { ViewWatchListResponse } from '@app/shared-library/api-contracts/bid/responses/view-watchlist.response';
import { GetUsersResponse } from '@app/shared-library/api-contracts/auth/responses/get-users.response';
import GetUsersMessage from '@app/shared-library/messages/get-users.message';
import { BiddingHistoryItem } from '@app/shared-library/types/bidding-history';
import { GetAuctionItemsByListingitemIdsResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-auction-items-by-listing-item-ids.response';
import GetAuctionItemsByListingItemsIdsMessage from '@app/shared-library/messages/get-auction-items-by-listing-ids.message';
import { WatchListItem } from '../entities/watch-list-item.entity';

@Injectable()
export class BidService {
  constructor(
    private bidRepository: BidRepository,
    private watchListItemRepository: WatchListItemRepository,
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  async handlePlaceBid(data: PlaceBidRequest, bidSessionId: string) {
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
      const updatedItem = this.handleForwardAuction(bidder_id, bid_amount, itemResponse);

      const placeBidResponse = await axios.post(`http://localhost:${API_GATEWAY_PORT}/bid/${bidSessionId}`);

      const bid = new Bid(bidder_id, listing_item_id, bid_amount, new Date().getTime());

      const createdBid = await this.bidRepository.createBid(bid);

      const watchListItem = new WatchListItem(bidder_id, listing_item_id);

      const createdWatchListItem = await this.watchListItemRepository.createWatchListItem(watchListItem);

      return updatedItem;
    } else {
      const updatedItem = this.handleDutchAuction(bidder_id, itemResponse);

      const placeBidResponse = await axios.post(`http://localhost:${API_GATEWAY_PORT}/bid/${bidSessionId}`);

      const bid = new Bid(bidder_id, listing_item_id, bid_amount, new Date().getTime());

      const createdBid = await this.bidRepository.createBid(bid);

      const watchListItem = new WatchListItem(bidder_id, listing_item_id);

      const createdWatchListItem = await this.watchListItemRepository.createWatchListItem(watchListItem);

      return updatedItem;
    }
  }

  async handleViewBiddingHistory(data: ViewBiddingHistoryMessage): Promise<ViewBiddingHistoryResponse> {
    const { listing_item_id } = data;

    const bids = await this.bidRepository.getBidsByListingItemId(listing_item_id);

    const bidderIds = bids.map((bid) => bid.bidder_id);

    // send list of user ids and get back list of users
    const users = (
      await new Promise<GetUsersResponse>((resolve, reject) => {
        this.authClient.send(GET_USERS_MESSAGE_PATTERN, new GetUsersMessage(bidderIds)).subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          },
        });
      })
    ).data;

    const biddingHistoryItems: BiddingHistoryItem[] = [];

    bids.forEach((bid) => {
      const user = users.find((user) => user.id === bid.bidder_id);
      if (user) {
        biddingHistoryItems.push(
          new BiddingHistoryItem(
            user.first_name + ' ' + user.last_name.substring(0, 1) + '.',
            bid.bid_amount,
            bid.created_at,
          ),
        );
      }
    });

    return new ViewBiddingHistoryResponse(
      biddingHistoryItems,
      'Bidding history retrieved successfully',
      'success',
    );
  }

  async handleViewWatchList(data: ViewWatchListMessage): Promise<ViewWatchListResponse> {
    // get all watch list items for user
    const watchListItems = await this.watchListItemRepository.getWatchListItemsByUserId(data.user_id);

    const listingItemIds = watchListItems.map((watchListItem) => watchListItem.listing_item_id);

    // send list of listing item ids and get back list of auction items
    const auctionItems = (
      await new Promise<GetAuctionItemsByListingitemIdsResponse>((resolve, reject) => {
        this.auctionManagementClient
          .send(
            GET_AUCTION_ITEMS_BY_LISTING_ITEM_IDS_MESSAGE_PATTERN,
            new GetAuctionItemsByListingItemsIdsMessage(listingItemIds),
          )
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

    return new ViewWatchListResponse(auctionItems, 'Watch list retrieved successfully', 'success');
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

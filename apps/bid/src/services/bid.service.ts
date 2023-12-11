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
import { Bid } from '@app/shared-library';
import ViewBiddingHistoryMessage from '@app/shared-library/messages/get-bidding-history.message';
import ViewWatchListMessage from '@app/shared-library/messages/view-watch-list.message';
import { ViewBiddingHistoryResponse } from '@app/shared-library/api-contracts/bid/responses/get-bidding-history-for-item.response';
import { ViewWatchListResponse } from '@app/shared-library/api-contracts/bid/responses/view-watchlist.response';
import { GetUsersResponse } from '@app/shared-library/api-contracts/auth/responses/get-users.response';
import GetUsersMessage from '@app/shared-library/messages/get-users.message';
import { BiddingHistoryItem } from '@app/shared-library/types/bidding-history';
import { GetAuctionItemsByListingitemIdsResponse } from '@app/shared-library/api-contracts/auction-management/responses/get-auction-items-by-listing-item-ids.response';
import GetAuctionItemsByListingItemsIdsMessage from '@app/shared-library/messages/get-auction-items-by-listing-ids.message';
import { WatchListItem } from '@app/shared-library';
import { WATCH_LISTING_ITEM_STATUS } from '@app/shared-library/types/status';
import { AuctionItem } from '@app/shared-library/entities/auction-management/auction-item.entity';
import * as https from 'https';

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

    const item = itemResponse.data.auction_item;

    const auctionItem = itemResponse.data.auction_item;

    const auctionType = auctionItem.auction_type;

    if (auctionType === 'forward' && bid_amount <= auctionItem.current_bid_price) {
      console.log('Bid must be higher than the current bid.');
      return false;
    }

    if (auctionType === 'dutch' && bid_amount !== auctionItem.current_bid_price) {
      console.log('Bid amount must be same as current bid price.');
      return false;
    }

    if (!item || new Date().getTime() >= item.end_time || itemResponse.data.has_been_sold) {
      console.log('Auction for this item has ended or does not exist.');
      return false;
    }

    // console.log('hereee2');

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    // console.log('agent1: ', agent);

    if (item.decrement_amount === -1) {
      const updatedItem = await this.handleForwardAuction(bidder_id, bid_amount, itemResponse);

      //TODO: consider making post requests to rabbitmq events for performance

      const placeBidResponse = await axios.post(
        `https://api-gateway:${API_GATEWAY_PORT}/api-gateway/bid/${bidSessionId}`,
        { listing_item_id: listing_item_id },
        { httpsAgent: agent },
      );

      // TODO: add error checking for placeBidResponse

      const bid = new Bid(bidder_id, listing_item_id, bid_amount, new Date().getTime());

      const createdBid = await this.bidRepository.createBid(bid);

      const watchListItem = new WatchListItem(bidder_id, listing_item_id);

      const createdWatchListItem = await this.watchListItemRepository.createWatchListItem(watchListItem);

      return updatedItem.data;
    } else {
      const updatedItem = await this.handleDutchAuction(bidder_id, itemResponse);

      const placeBidResponse = await axios.post(
        `https://api-gateway:${API_GATEWAY_PORT}/api-gateway/bid/${bidSessionId}`,
        { listing_item_id: listing_item_id },
        { httpsAgent: agent },
      );

      // TODO: add error checking for placeBidResponse

      const bid = new Bid(bidder_id, listing_item_id, bid_amount, new Date().getTime());

      const createdBid = await this.bidRepository.createBid(bid);

      const watchListItem = new WatchListItem(bidder_id, listing_item_id);

      const createdWatchListItem = await this.watchListItemRepository.createWatchListItem(watchListItem);

      await axios.post(
        `https://api-gateway:${API_GATEWAY_PORT}/api-gateway/update-all-sessions-bidding-on-item/${listing_item_id}`,
        {},
        { httpsAgent: agent },
      );

      return updatedItem.data;
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
            // user.first_name + ' ' + user.last_name.substring(0, 1) + '.',
            user.username,
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

    const watchListItemsWithStatus: (AuctionItem & { status: string })[] = [];

    for (const auctionItem of auctionItems) {
      let status: string;

      const highestBid = await this.bidRepository.getHighestBidByListingItem_id(auctionItem.listing_item_id);

      const highestBidderId = highestBid?.bidder_id;

      const auctionHasEnded = auctionItem.end_time <= new Date().getTime();

      // default -> status = watching
      // highestBidderId === userId -> status = highest bidder
      // highestBidderId !== userId -> status = outbid

      if (
        (auctionHasEnded && highestBid && highestBidderId === data.user_id) ||
        (auctionItem.has_been_sold && highestBidderId === data.user_id)
      ) {
        status = WATCH_LISTING_ITEM_STATUS.WON;
      } else if (highestBid && highestBidderId === data.user_id) {
        status = WATCH_LISTING_ITEM_STATUS.HIGHEST_BIDDER;
      } else if (highestBid && highestBidderId !== data.user_id) {
        status = WATCH_LISTING_ITEM_STATUS.OUTBID;
      } else {
        status = WATCH_LISTING_ITEM_STATUS.WATCHING;
      }

      watchListItemsWithStatus.push({ ...auctionItem, status: status });
    }

    return new ViewWatchListResponse(watchListItemsWithStatus, 'Watch list retrieved successfully', 'success');
  }

  private async handleForwardAuction(
    bidder_id: number,
    bid_amount: number,
    itemResponse: GetAuctionItemResponse,
  ): Promise<PlaceBidResponse> {
    const auctionItem = itemResponse.data.auction_item;

    const updatedAuctionItem = await new Promise<PlaceBidResponse>((resolve, reject) => {
      this.auctionManagementClient
        .send(
          PLACE_FORWARD_BID_AUCTION_MESSAGE_PATTERN,
          new PlaceForwardBidMessage(bidder_id, auctionItem.listing_item_id, auctionItem.id, bid_amount),
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
    const item = itemResponse.data.auction_item;

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

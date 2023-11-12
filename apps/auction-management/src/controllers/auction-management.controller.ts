import { Controller } from '@nestjs/common';
import { AuctionManagementService } from '../services/auction-management.service';
import {
  CREATE_LISTING_ITEM_EVENT_PATTERN,
  GET_AUCTION_ITEMS_FOR_SELLER_MESSAGE_PATTERN,
  RmqService,
  SEARCH_CATALOG_MESSAGE_PATTERN,
  START_AUCTION_EVENT_PATTERN,
  VIEW_CATALOG_MESSAGE_PATTERN,
  VIEW_LISTING_ITEMS_MESSAGE_PATTERN,
  VIEW_LISTING_MESSAGE_PATTERN,
} from '@app/shared-library';
import StartAuctionEvent from '@app/shared-library/events/start-auction.event';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import ViewCatalogMessage from '@app/shared-library/messages/view-catalog.message';
import SearchCatalogMessage from '@app/shared-library/messages/search-catalog.message';
import GetAuctionItemsForSellerMessage from '@app/shared-library/messages/get-auction-items-for-seller.message';
import CreateListingItemEvent from '@app/shared-library/events/create-listing-item.event';
import ViewListingItemsMessage from '@app/shared-library/messages/view-listing-items.message';
import ViewListingMessage from '@app/shared-library/messages/view-listing.message';

@Controller()
export class AuctionManagementController {
  constructor(
    private readonly auctionManagementService: AuctionManagementService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(GET_AUCTION_ITEMS_FOR_SELLER_MESSAGE_PATTERN)
  handleGetAllAuctionItemsForSeller(@Payload() data: GetAuctionItemsForSellerMessage, @Ctx() context: RmqContext) {
    const handleGetAllAuctionItemsForSellerResponse =
      this.auctionManagementService.handleGetAllAuctionItemsForSeller(data);
    this.rmqService.ack(context);
    return handleGetAllAuctionItemsForSellerResponse;
  }

  @EventPattern(CREATE_LISTING_ITEM_EVENT_PATTERN)
  handleCreateListingItem(@Payload() data: CreateListingItemEvent, @Ctx() context: RmqContext) {
    console.log('handleCreateListingItem');
    this.rmqService.ack(context);
    return this.auctionManagementService.handleCreateListingItem(data);
  }

  @MessagePattern(VIEW_LISTING_MESSAGE_PATTERN)
  handleViewListing(@Payload() data: ViewListingMessage, @Ctx() context: RmqContext) {
    const handleViewListingItemsResponse = this.auctionManagementService.handleViewListing(data);
    this.rmqService.ack(context);
    return handleViewListingItemsResponse;
  }

  // @MessagePattern(VIEW_LISTING_ITEMS_MESSAGE_PATTERN)
  // handleViewListingItems(@Payload() data: ViewListingItemsMessage, @Ctx() context: RmqContext) {
  //   const handleViewListingItemsResponse = this.auctionManagementService.handleViewListingItems(data);
  //   this.rmqService.ack(context);
  //   return handleViewListingItemsResponse;
  // }

  // @EventPattern(START_AUCTION_EVENT_PATTERN)
  // handleStartAuction(@Payload() data: StartAuctionEvent, @Ctx() context: RmqContext) {
  //   this.rmqService.ack(context);
  //   return this.auctionManagementService.handleStartAuction(data);
  // }

  @MessagePattern(VIEW_CATALOG_MESSAGE_PATTERN)
  handleViewCatalog(@Payload() data: ViewCatalogMessage, @Ctx() context: RmqContext) {
    const handleViewCatalogResponse = this.auctionManagementService.handleViewCatalog(data);
    this.rmqService.ack(context);
    return handleViewCatalogResponse;
  }

  @MessagePattern(SEARCH_CATALOG_MESSAGE_PATTERN)
  handleSearchCatalog(@Payload() data: SearchCatalogMessage, @Ctx() context: RmqContext) {
    const handleSearchCatalogResponse = this.auctionManagementService.handleSearchCatalog(data);
    this.rmqService.ack(context);
    return handleSearchCatalogResponse;
  }
}

import { Controller } from '@nestjs/common';
import { AuctionManagementService } from '../services/auction-management.service';
import {
  CREATE_LISTING_ITEM_MESSAGE_PATTERN,
  GET_AUCTION_ITEMS_FOR_SELLER_MESSAGE_PATTERN,
  GET_LISTING_ITEM_MESSAGE_PATTERN,
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
import CreateListingItemEvent from '@app/shared-library/messages/create-listing-item.message';
import ViewListingItemsMessage from '@app/shared-library/messages/view-listing-items.message';
import ViewListingMessage from '@app/shared-library/messages/view-listing.message';

@Controller()
export class AuctionManagementController {
  constructor(
    private readonly auctionManagementService: AuctionManagementService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(GET_AUCTION_ITEMS_FOR_SELLER_MESSAGE_PATTERN)
  async handleGetAllAuctionItemsForSeller(
    @Payload() data: GetAuctionItemsForSellerMessage,
    @Ctx() context: RmqContext,
  ) {
    const handleGetAllAuctionItemsForSellerResponse =
      await this.auctionManagementService.handleGetAllAuctionItemsForSeller(data);
    this.rmqService.ack(context);
    return handleGetAllAuctionItemsForSellerResponse;
  }

  @MessagePattern(CREATE_LISTING_ITEM_MESSAGE_PATTERN)
  async handleCreateListingItem(@Payload() data: CreateListingItemEvent, @Ctx() context: RmqContext) {
    const createdListingItem = await this.auctionManagementService.handleCreateListingItem(data);
    this.rmqService.ack(context);
    return createdListingItem;
  }

  @MessagePattern(GET_LISTING_ITEM_MESSAGE_PATTERN)
  async handleGetListingItem(@Payload() data: CreateListingItemEvent, @Ctx() context: RmqContext) {
    const listingItem = await this.auctionManagementService.handleGetListingItem(data);
    this.rmqService.ack(context);
    return listingItem;
  }

  @MessagePattern(VIEW_LISTING_MESSAGE_PATTERN)
  async handleViewListing(@Payload() data: ViewListingMessage, @Ctx() context: RmqContext) {
    const handleViewListingItemsResponse = await this.auctionManagementService.handleViewListing(data);
    this.rmqService.ack(context);
    return handleViewListingItemsResponse;
  }

  @EventPattern(START_AUCTION_EVENT_PATTERN)
  handleStartAuction(@Payload() data: StartAuctionEvent, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.auctionManagementService.handleStartAuction(data);
  }

  @MessagePattern(VIEW_CATALOG_MESSAGE_PATTERN)
  async handleViewCatalog(@Payload() data: ViewCatalogMessage, @Ctx() context: RmqContext) {
    const handleViewCatalogResponse = await this.auctionManagementService.handleViewCatalog(data);
    this.rmqService.ack(context);
    return handleViewCatalogResponse;
  }

  @MessagePattern(SEARCH_CATALOG_MESSAGE_PATTERN)
  async handleSearchCatalog(@Payload() data: SearchCatalogMessage, @Ctx() context: RmqContext) {
    console.log('handleSearchCatalog');
    const handleSearchCatalogResponse = await this.auctionManagementService.handleSearchCatalog(data);
    this.rmqService.ack(context);
    return handleSearchCatalogResponse;
  }
}

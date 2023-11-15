import { Controller } from '@nestjs/common';
import { AuctionManagementService } from '../services/auction-management.service';
import {
  CREATE_LISTING_ITEM_MESSAGE_PATTERN,
  GET_AUCTION_ITEMS_BY_LISTING_ITEM_IDS_MESSAGE_PATTERN,
  GET_AUCTION_ITEMS_FOR_SELLER_MESSAGE_PATTERN,
  GET_AUCTION_ITEM_MESSAGE_PATTERN,
  GET_IS_BEING_AUCTIONED_MESSAGE_PATTERN,
  GET_LISTING_ITEM_BY_ID_MESSAGE_PATTERN,
  GET_LISTING_ITEM_MESSAGE_PATTERN,
  PLACE_DUTCH_BID_AUCTION_MESSAGE_PATTERN,
  PLACE_FORWARD_BID_AUCTION_MESSAGE_PATTERN,
  RmqService,
  SEARCH_CATALOG_MESSAGE_PATTERN,
  SELL_AUCITON_ITEM_MESSAGE_PATTERN,
  START_AUCTION_EVENT_PATTERN,
  UPDATE_LISTING_ITEM_MESSAGE_PATTERN,
  VIEW_CATALOG_MESSAGE_PATTERN,
  VIEW_LISTING_MESSAGE_PATTERN,
} from '@app/shared-library';
import StartAuctionEvent from '@app/shared-library/events/start-auction.event';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import ViewCatalogMessage from '@app/shared-library/messages/view-catalog.message';
import SearchCatalogMessage from '@app/shared-library/messages/search-catalog.message';
import GetAuctionItemsForSellerMessage from '@app/shared-library/messages/get-auction-items-for-seller.message';
import CreateListingItemEvent from '@app/shared-library/messages/create-listing-item.message';
import ViewListingMessage from '@app/shared-library/messages/view-listing.message';
import GetAuctionItemMessage from '@app/shared-library/messages/get-auction-item.message';
import PlaceForwardBidMessage from '@app/shared-library/messages/place-forward-bid.message';
import PlaceDutchBidMessage from '@app/shared-library/messages/place-dutch-bid.message';
import SellAuctionItemMessage from '@app/shared-library/messages/sell-auction-item.message';
import GetAuctionItemsByListingItemsIdsMessage from '@app/shared-library/messages/get-auction-items-by-listing-ids.message';
import GetListingItemByIdMessage from '@app/shared-library/messages/get-listing-item-by-id.message';
import UpdateListingItemMessage from '@app/shared-library/messages/update-listing-item.message';
import GetIsBeingAuctionedMessage from '@app/shared-library/messages/get-is-being-auctioned.message';

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

  @MessagePattern(GET_AUCTION_ITEM_MESSAGE_PATTERN)
  async handleGetAuctionItem(@Payload() data: GetAuctionItemMessage, @Ctx() context: RmqContext) {
    const auctionItemResponse = await this.auctionManagementService.handleGetAuctionItem(data);
    this.rmqService.ack(context);
    return auctionItemResponse;
  }

  @MessagePattern(PLACE_FORWARD_BID_AUCTION_MESSAGE_PATTERN)
  async handlePlaceForwardBidAuction(@Payload() data: PlaceForwardBidMessage, @Ctx() context: RmqContext) {
    const auctionItemResponse = await this.auctionManagementService.handlePlaceForwardBidAuction(data);
    this.rmqService.ack(context);
    return auctionItemResponse;
  }

  @MessagePattern(PLACE_DUTCH_BID_AUCTION_MESSAGE_PATTERN)
  async handlePlaceDutchBidAuction(@Payload() data: PlaceDutchBidMessage, @Ctx() context: RmqContext) {
    const auctionItemResponse = await this.auctionManagementService.handlePlaceDutchBidAuction(data);
    this.rmqService.ack(context);
    return auctionItemResponse;
  }

  @MessagePattern(SELL_AUCITON_ITEM_MESSAGE_PATTERN)
  async handleSellAuctionItem(@Payload() data: SellAuctionItemMessage, @Ctx() context: RmqContext) {
    const listingItemResponse = await this.auctionManagementService.handleSellAuctionItem(data.listing_item_id);
    this.rmqService.ack(context);
    return listingItemResponse;
  }

  @MessagePattern(GET_AUCTION_ITEMS_BY_LISTING_ITEM_IDS_MESSAGE_PATTERN)
  async handleGetAuctionItemsByListingItemsIds(
    @Payload() data: GetAuctionItemsByListingItemsIdsMessage,
    @Ctx() context: RmqContext,
  ) {
    const auctionItemsResponse = await this.auctionManagementService.handleGetAuctionItemsByListingItemsIds(data);
    this.rmqService.ack(context);
    return auctionItemsResponse;
  }

  @MessagePattern(GET_LISTING_ITEM_BY_ID_MESSAGE_PATTERN)
  async handleGetListingItemById(
    @Payload() getListingItemByIdMessage: GetListingItemByIdMessage,
    @Ctx() context: RmqContext,
  ) {
    const listingItemResponse =
      await this.auctionManagementService.handleGetListingItemById(getListingItemByIdMessage);
    this.rmqService.ack(context);
    return listingItemResponse;
  }

  @MessagePattern(UPDATE_LISTING_ITEM_MESSAGE_PATTERN)
  async handleUpdateListingItem(
    @Payload() updateListingItemMessage: UpdateListingItemMessage,
    @Ctx() context: RmqContext,
  ) {
    const listingItemResponse =
      await this.auctionManagementService.handleUpdateListingItem(updateListingItemMessage);
    this.rmqService.ack(context);
    return listingItemResponse;
  }

  @MessagePattern(GET_IS_BEING_AUCTIONED_MESSAGE_PATTERN)
  async handleGetIsBeingAuctioned(
    @Payload() getIsBeingAuctionedMessage: GetIsBeingAuctionedMessage,
    @Ctx() context: RmqContext,
  ) {
    const getIsBeingAuctionedResponse =
      await this.auctionManagementService.handleGetIsBeingAuctioned(getIsBeingAuctionedMessage);
    this.rmqService.ack(context);
    return getIsBeingAuctionedResponse;
  }
}

import { Controller } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import CreateListingEvent from '@app/shared-library/events/create-listing.event';
import { CREATE_LISTING_EVENT_PATTERN } from '@app/shared-library/events';
import {
  GET_ALL_ACTIVE_ITEMS_MESSAGE_PATTERN,
  GET_AUCTION_TYPE_BY_NAME_MESSAGE_PATTERN,
  GET_AUCTION_TYPE_MESSAGE_PATTERN,
  SEARCH_FOR_LISTING_ITEMS_ID_BY_KEYWORD_MESSAGE_PATTERN,
  VIEW_LISTING_MESSAGE_PATTERN,
} from '@app/shared-library/messages';
import ViewListingMessage from '@app/shared-library/messages/view-listing.message';
import { RmqService } from '@app/shared-library';
import GetAuctionTypeMessage from '@app/shared-library/messages/get-auction-type.message';
import SearchForListingItemsIdByKeywordMessage from '@app/shared-library/messages/search-for-listing-items-id-by-keyword.message';
import GetAuctionTypeByNameMessage from '@app/shared-library/messages/get-auction-type-by-name.message';

@Controller()
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(CREATE_LISTING_EVENT_PATTERN)
  async handleCreateListing(@Payload() data: CreateListingEvent, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.inventoryService.handleCreateListing(data);
  }

  @MessagePattern(GET_AUCTION_TYPE_MESSAGE_PATTERN)
  async handleGetAuctionType(@Payload() data: GetAuctionTypeMessage, @Ctx() context: RmqContext) {
    const handleGetAuctionTypeResponse = await this.inventoryService.handleGetAuctionType(data);
    this.rmqService.ack(context);
    return handleGetAuctionTypeResponse;
  }

  @MessagePattern(GET_AUCTION_TYPE_BY_NAME_MESSAGE_PATTERN)
  async handleGetAuctionTypeByName(@Payload() data: GetAuctionTypeByNameMessage, @Ctx() context: RmqContext) {
    const handleGetAuctionTypeByNameResponse = await this.inventoryService.handleGetAuctionTypeByName(data);
    this.rmqService.ack(context);
    return handleGetAuctionTypeByNameResponse;
  }

  @MessagePattern(SEARCH_FOR_LISTING_ITEMS_ID_BY_KEYWORD_MESSAGE_PATTERN)
  async handleSearchForListingItemsIdByKeyword(
    @Payload() data: SearchForListingItemsIdByKeywordMessage,
    @Ctx() context: RmqContext,
  ) {
    const handleSearchForListingItemsIdByKeywordResponse =
      await this.inventoryService.handleSearchForListingItemsIdByKeyword(data);
    this.rmqService.ack(context);
    return handleSearchForListingItemsIdByKeywordResponse;
  }
}

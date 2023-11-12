import { Controller } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import CreateListingEvent from '@app/shared-library/events/create-listing.event';
import { CREATE_LISTING_EVENT_PATTERN } from '@app/shared-library/events';
import { GET_ALL_ACTIVE_ITEMS_MESSAGE_PATTERN, VIEW_LISTING_MESSAGE_PATTERN } from '@app/shared-library/messages';
import ViewListingMessage from '@app/shared-library/messages/view-listing.message';
import { RmqService } from '@app/shared-library';

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

  // @MessagePattern(VIEW_LISTING_MESSAGE_PATTERN)
  // async handleViewListing(@Payload() data: ViewListingMessage, @Ctx() context: RmqContext) {
  //   console.log('handleViewListing');
  //   const handleViewListingResponse = this.inventoryService.handleViewListing(data);
  //   this.rmqService.ack(context);
  //   return handleViewListingResponse;
  // }

  @MessagePattern(GET_ALL_ACTIVE_ITEMS_MESSAGE_PATTERN)
  async handleGetAllActiveItems(@Ctx() context: RmqContext) {
    const handleGetAllActiveItemsResponse = this.inventoryService.handleGetAllActiveItems();
    this.rmqService.ack(context);
    return handleGetAllActiveItemsResponse;
  }
}

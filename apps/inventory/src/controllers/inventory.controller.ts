import { Controller } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import CreateListingEvent from '@app/shared-library/events/create-listing.event';
import { CREATE_LISTING_EVENT_PATTERN } from '@app/shared-library/events';
import { GET_ALL_ACTIVE_ITEMS_MESSAGE_PATTERN, VIEW_LISTING_MESSAGE_PATTERN } from '@app/shared-library/messages';
import ViewListingMessage from '@app/shared-library/messages/view-listing.message';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @EventPattern(CREATE_LISTING_EVENT_PATTERN)
  handleSendValidationCode(data: CreateListingEvent) {
    return this.inventoryService.handleCreateListing(data);
  }

  @MessagePattern(VIEW_LISTING_MESSAGE_PATTERN)
  async handleViewListing(data: ViewListingMessage) {
    return this.inventoryService.handleViewListing(data);
  }

  @MessagePattern(GET_ALL_ACTIVE_ITEMS_MESSAGE_PATTERN)
  async handleGetAllActiveItems() {
    return this.inventoryService.handleGetAllActiveItems();
  }
}

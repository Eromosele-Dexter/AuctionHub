import { Controller } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { EventPattern } from '@nestjs/microservices';
import CreateListingEvent from '@app/shared-library/events/create-listing.event';
import { CREATE_LISTING_EVENT_PATTERN } from '@app/shared-library/events';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @EventPattern(CREATE_LISTING_EVENT_PATTERN)
  handleSendValidationCode(data: CreateListingEvent) {
    return this.inventoryService.handleCreateListing(data);
  }
}

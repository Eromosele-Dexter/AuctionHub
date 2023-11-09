import { Controller, Get } from '@nestjs/common';
import { AuctionManagementService } from '../services/auction-management.service';
import {
  SEARCH_CATALOG_MESSAGE_PATTERN,
  START_AUCTION_EVENT_PATTERN,
  VIEW_CATALOG_MESSAGE_PATTERN,
} from '@app/shared-library';
import StartAuctionEvent from '@app/shared-library/events/start-auction.event';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import ViewCatalogMessage from '@app/shared-library/messages/view-catalog.message';
import SearchCatalogMessage from '@app/shared-library/messages/search-catalog.message';

@Controller()
export class AuctionManagementController {
  constructor(private readonly auctionManagementService: AuctionManagementService) {}

  @EventPattern(START_AUCTION_EVENT_PATTERN)
  handleStartAuction(data: StartAuctionEvent) {
    return this.auctionManagementService.handleStartAuction(data);
  }

  @MessagePattern(VIEW_CATALOG_MESSAGE_PATTERN)
  handleViewCatalog(data: ViewCatalogMessage) {
    console.log('Auction Management Controller');
    return this.auctionManagementService.handleViewCatalog(data);
  }

  @MessagePattern(SEARCH_CATALOG_MESSAGE_PATTERN)
  handleSearchCatalog(data: SearchCatalogMessage) {
    return this.auctionManagementService.handleSearchCatalog(data);
  }
}

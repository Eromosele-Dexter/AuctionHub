import { Controller } from '@nestjs/common';
import { AuctionManagementService } from '../services/auction-management.service';
import {
  RmqService,
  SEARCH_CATALOG_MESSAGE_PATTERN,
  START_AUCTION_EVENT_PATTERN,
  VIEW_CATALOG_MESSAGE_PATTERN,
} from '@app/shared-library';
import StartAuctionEvent from '@app/shared-library/events/start-auction.event';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import ViewCatalogMessage from '@app/shared-library/messages/view-catalog.message';
import SearchCatalogMessage from '@app/shared-library/messages/search-catalog.message';

@Controller()
export class AuctionManagementController {
  constructor(
    private readonly auctionManagementService: AuctionManagementService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(START_AUCTION_EVENT_PATTERN)
  handleStartAuction(@Payload() data: StartAuctionEvent, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.auctionManagementService.handleStartAuction(data);
  }

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

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { ClientKafka } from '@nestjs/microservices';
import {
  AUCTION_MANAGEMENT_SERVICE,
  AUTH_SERVICE,
  BID_SERVICE,
  CREATE_LISTING_EVENT_PATTERN,
  INVENTORY_SERVICE,
  PAYMENT_SERVICE,
  REGISTER_USER_MESSAGE_PATTERN,
} from '@app/shared-library';
import { CreateListingRequest } from '@app/shared-library/api-contracts/inventory/requests';
import { CreateListingResponse } from '@app/shared-library/api-contracts/inventory/responses';
import CreateListingEvent from '@app/shared-library/events/create-listing.event';

@Injectable()
export class SellerEventService implements OnModuleInit {
  constructor(
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientKafka,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientKafka,
    @Inject(BID_SERVICE) private readonly bidClient: ClientKafka,
    @Inject(INVENTORY_SERVICE) private readonly inventoryClient: ClientKafka,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf(REGISTER_USER_MESSAGE_PATTERN);
    await this.authClient.connect();
  }

  async createListing(createListingRequest: CreateListingRequest) {
    this.inventoryClient.emit(
      CREATE_LISTING_EVENT_PATTERN,
      new CreateListingEvent(
        createListingRequest.sellerId,
        createListingRequest.name,
        createListingRequest.description,
        createListingRequest.image,
        new Date(),
        createListingRequest.auctionType,
        createListingRequest.keyword1,
        createListingRequest.keyword2,
        createListingRequest.keyword3,
      ),
    );
  }
}

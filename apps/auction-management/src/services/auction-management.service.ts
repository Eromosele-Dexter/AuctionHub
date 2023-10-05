import { Injectable } from '@nestjs/common';
import { AuctionListingItemRepository } from '../repositories/auction-listing-item-repo/auction-listing-item.repository';
import { AuctionListingRepository } from '../repositories/auction-listing-repo/auction-listing.repository';

@Injectable()
export class AuctionManagementService {
  constructor(
    private auctionListingItemRepository: AuctionListingItemRepository,
    private auctionListingRepository: AuctionListingRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}

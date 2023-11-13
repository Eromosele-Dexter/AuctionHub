import { Inject, Injectable } from '@nestjs/common';
import { AuctionItemRepository } from '../../../auction-management/src/repositories/auction-item-repo/auction-item.repository';
import { BidRepository } from '../repositories/bid-repo/bid.repository';
import { WatchListItemRepository } from '../repositories/watch-list-item-repo/watch-list-item.repository';
import { WatchListRepository } from '../repositories/watch-list-repo/watch-list.repository';
import { AUCTION_MANAGEMENT_SERVICE } from '@app/shared-library';
import { ClientProxy } from '@nestjs/microservices';
import { PlaceBidRequest } from '@app/shared-library/api-contracts/bid/requests/place-bid.request';

@Injectable()
export class BidService {
  constructor(
    private auctionItemRepository: AuctionItemRepository,
    private bidRepository: BidRepository,
    private watchListItemRepository: WatchListItemRepository,
    private watchListRepository: WatchListRepository,
    @Inject(AUCTION_MANAGEMENT_SERVICE) private readonly auctionManagementClient: ClientProxy,
  ) {}

  async handlePlaceBid(data: PlaceBidRequest) {}
}

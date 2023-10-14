import { Injectable } from '@nestjs/common';
import { AuctionItemRepository } from '../../../auction-management/src/repositories/auction-item-repo/auction-item.repository';
import { BidRepository } from '../repositories/bid-repo/bid.repository';
import { WatchListItemRepository } from '../repositories/watch-list-item-repo/watch-list-item.repository';
import { WatchListRepository } from '../repositories/watch-list-repo/watch-list.repository';

@Injectable()
export class BidService {
  constructor(
    private auctionItemRepository: AuctionItemRepository,
    private bidRepository: BidRepository,
    private watchListItemRepository: WatchListItemRepository,
    private watchListRepository: WatchListRepository,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
}

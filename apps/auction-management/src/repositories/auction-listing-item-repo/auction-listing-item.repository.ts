import { DataSource, Repository } from 'typeorm';
import { IAuctionListingItemRepository } from './auction-listing-item.repository.interface';
import { AuctionListingItem } from '../../entities/auction-listing-item.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuctionListingItemRepository
  extends Repository<AuctionListingItem>
  implements IAuctionListingItemRepository
{
  private readonly logger = new Logger(AuctionListingItemRepository.name);

  constructor(private dataSource: DataSource) {
    super(AuctionListingItem, dataSource.createEntityManager());
  }

  createAuctionListingItem(
    auctionListingItem: AuctionListingItem,
  ): Promise<AuctionListingItem> {
    throw new Error('Method not implemented.');
  }
  getAuctionListingItemById(id: number): Promise<AuctionListingItem> {
    throw new Error('Method not implemented.');
  }
  getAuctionListingItems(): Promise<AuctionListingItem[]> {
    throw new Error('Method not implemented.');
  }
  updateAuctionListingItem(
    auctionListingItem: AuctionListingItem,
  ): Promise<AuctionListingItem> {
    throw new Error('Method not implemented.');
  }
  deleteAuctionListingItem(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getAuctionListingItemsByAuctionListingId(
    auctionListingId: number,
  ): Promise<AuctionListingItem[]> {
    throw new Error('Method not implemented.');
  }
}

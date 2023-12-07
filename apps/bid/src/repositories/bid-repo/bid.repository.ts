import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Bid } from '../../entities/bid.entity';
import { IBidRepository } from './bid.repository.interface';

@Injectable()
export class BidRepository extends Repository<Bid> implements IBidRepository {
  private readonly logger = new Logger(BidRepository.name);

  constructor(private dataSource: DataSource) {
    super(Bid, dataSource.createEntityManager());
  }

  async createBid(bid: Bid): Promise<Bid> {
    this.dataSource.manager.create(Bid, bid);
    return this.save(bid);
  }

  async getBidsByListingItemId(listing_item_id: number): Promise<Bid[]> {
    if (!listing_item_id) {
      return [];
    }
    const bids = await this.dataSource.manager.query(
      `SELECT * FROM bids WHERE listing_item_id = ${listing_item_id} ORDER BY created_at DESC`,
    );
    return bids;
  }

  async getBidById(id: number): Promise<Bid> {
    throw new Error('Method not implemented.');
  }
  async getBids(): Promise<Bid[]> {
    throw new Error('Method not implemented.');
  }
  async updateBid(bid: Bid): Promise<Bid> {
    throw new Error('Method not implemented.');
  }
  async deleteBid(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async getBidsByAuctionitem_id(auctionitem_id: number): Promise<Bid[]> {
    throw new Error('Method not implemented.');
  }
  async getHighestBidByListingItem_id(listing_item_id: number): Promise<Bid> {
    const bids = await this.dataSource.manager.query(
      `SELECT * FROM bids WHERE listing_item_id = ${listing_item_id} ORDER BY bid_amount DESC LIMIT 1`,
    );
    return bids[0];
  }
}

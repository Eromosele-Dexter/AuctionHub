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
    throw new Error('Method not implemented.');
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
  async getHighestBidByAuctionitem_id(auctionitem_id: number): Promise<Bid> {
    throw new Error('Method not implemented.');
  }
}

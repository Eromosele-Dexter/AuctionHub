import { Injectable, Logger } from '@nestjs/common';
import { IAuctionListingRepository } from './auction-listing.repository.interface';
import { Repository, DataSource } from 'typeorm';
import { AuctionListing } from '../../entities/auction-listing.entity';

@Injectable()
export class AuctionListingRepository
  extends Repository<AuctionListing>
  implements IAuctionListingRepository
{
  private readonly logger = new Logger(AuctionListingRepository.name);

  constructor(private dataSource: DataSource) {
    super(AuctionListing, dataSource.createEntityManager());
  }

  async getAuctionListingById(id: number): Promise<AuctionListing> {
    throw new Error('Method not implemented.');
  }

  async getAuctionListings(): Promise<AuctionListing[]> {
    throw new Error('Method not implemented.');
  }

  async updateAuctionListing(
    auctionListing: AuctionListing,
  ): Promise<AuctionListing> {
    throw new Error('Method not implemented.');
  }

  async deleteAuctionListing(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getAuctionListingByUserId(userId: number): Promise<AuctionListing[]> {
    throw new Error('Method not implemented.');
  }

  async createAuctionListing(
    auctionListing: AuctionListing,
  ): Promise<AuctionListing> {
    throw new Error('Method not implemented.');
  }
}

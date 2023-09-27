import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IAuctionTypeRepository } from './auction-type.repository.interface';
import { AuctionType } from '../../entities/auction-type.entity';

@Injectable()
export class AuctionTypeRepository
  extends Repository<AuctionType>
  implements IAuctionTypeRepository
{
  private readonly logger = new Logger(AuctionTypeRepository.name);

  constructor(private dataSource: DataSource) {
    super(AuctionType, dataSource.createEntityManager());
  }

  async createAuctionType(auctionType: AuctionType): Promise<AuctionType> {
    throw new Error('Method not implemented.');
  }
  async getAuctionTypeById(id: number): Promise<AuctionType> {
    throw new Error('Method not implemented.');
  }
  async getAuctionTypes(): Promise<AuctionType[]> {
    throw new Error('Method not implemented.');
  }
  async updateAuctionType(auctionType: AuctionType): Promise<AuctionType> {
    throw new Error('Method not implemented.');
  }
  async deleteAuctionType(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

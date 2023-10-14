import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IAuctionTypeRepository } from './auction-type.repository.interface';
import { AuctionType } from '../../entities/auction-type.entity';

@Injectable()
export class AuctionTypeRepository extends Repository<AuctionType> implements IAuctionTypeRepository {
  private readonly logger = new Logger(AuctionTypeRepository.name);

  constructor(private dataSource: DataSource) {
    super(AuctionType, dataSource.createEntityManager());
  }

  async createAuctionType(auctionType: AuctionType): Promise<AuctionType> {
    this.dataSource.manager.create(AuctionType, auctionType);
    return this.save(auctionType);
  }
  async getAuctionTypeByName(auctionTypeName: string): Promise<AuctionType> {
    const auctionType = await this.dataSource.manager.query(
      `SELECT * FROM auction_types WHERE name = '${auctionTypeName}'`,
    );
    return auctionType[0];
  }
  async getAuctionTypeById(id: number): Promise<AuctionType> {
    const auctionType = this.dataSource.manager.query('SELECT * FROM auction_types WHERE id = $1', [id]);
    return auctionType[0];
  }
  async getAuctionTypes(): Promise<AuctionType[]> {
    return this.find();
  }

  async deleteAuctionType(id: number): Promise<void> {
    this.delete(id);
  }
}

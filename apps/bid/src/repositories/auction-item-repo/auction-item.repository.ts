import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuctionItem } from '../../entities/auction-item.entity';
import { IAuctionItemRepository } from './auction-item.repository.interface';

@Injectable()
export class AuctionItemRepository
  extends Repository<AuctionItem>
  implements IAuctionItemRepository
{
  private readonly logger = new Logger(AuctionItemRepository.name);

  constructor(private dataSource: DataSource) {
    super(AuctionItem, dataSource.createEntityManager());
  }

  async createAuctionItem(auctionItem: AuctionItem): Promise<AuctionItem> {
    throw new Error('Method not implemented.');
  }
  async getAuctionItemById(id: number): Promise<AuctionItem> {
    throw new Error('Method not implemented.');
  }
  async getAuctionItems(): Promise<AuctionItem[]> {
    throw new Error('Method not implemented.');
  }
  async updateAuctionItem(auctionItem: AuctionItem): Promise<AuctionItem> {
    throw new Error('Method not implemented.');
  }
  async deleteAuctionItem(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

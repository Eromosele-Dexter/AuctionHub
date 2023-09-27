import { DataSource, Repository } from 'typeorm';
import { WatchListItem } from '../../entities/watch-list-item.entity';
import { Injectable, Logger } from '@nestjs/common';
import { IWatchListItemRepository } from './watch-list-item.repository.interface';

@Injectable()
export class WatchListItemRepository
  extends Repository<WatchListItem>
  implements IWatchListItemRepository
{
  private readonly logger = new Logger(WatchListItemRepository.name);

  constructor(private dataSource: DataSource) {
    super(WatchListItem, dataSource.createEntityManager());
  }
  getWatchListItemsByUserId(userId: number): Promise<WatchListItem[]> {
    throw new Error('Method not implemented.');
  }

  async createWatchListItem(
    watchListItem: WatchListItem,
  ): Promise<WatchListItem> {
    throw new Error('Method not implemented.');
  }
  async getWatchListItemById(id: number): Promise<WatchListItem> {
    throw new Error('Method not implemented.');
  }
  async getWatchListItems(): Promise<WatchListItem[]> {
    throw new Error('Method not implemented.');
  }
  async updateWatchListItem(
    watchListItem: WatchListItem,
  ): Promise<WatchListItem> {
    throw new Error('Method not implemented.');
  }
  async deleteWatchListItem(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getWatchListItemByUserIdAndAuctionItemId(
    userId: number,
    auctionItemId: number,
  ): Promise<WatchListItem> {
    throw new Error('Method not implemented.');
  }
}
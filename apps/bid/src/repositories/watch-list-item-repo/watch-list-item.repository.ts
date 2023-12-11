import { DataSource, Repository } from 'typeorm';
import { WatchListItem } from '../../../../../libs/shared-library/src/entities/bid/watch-list-item.entity';
import { Injectable, Logger } from '@nestjs/common';
import { IWatchListItemRepository } from './watch-list-item.repository.interface';

@Injectable()
export class WatchListItemRepository extends Repository<WatchListItem> implements IWatchListItemRepository {
  private readonly logger = new Logger(WatchListItemRepository.name);

  constructor(private dataSource: DataSource) {
    super(WatchListItem, dataSource.createEntityManager());
  }
  async getWatchListItemsByUserId(userId: number): Promise<WatchListItem[]> {
    const watchListItems = await this.dataSource.manager.query(
      `SELECT * FROM watch_list_items WHERE bidder_id = ${userId}`,
    );
    return watchListItems;
  }

  async createWatchListItem(watchListItem: WatchListItem): Promise<WatchListItem> {
    this.dataSource.manager.create(WatchListItem, watchListItem);
    return this.save(watchListItem);
  }

  async getWatchListItemById(id: number): Promise<WatchListItem> {
    throw new Error('Method not implemented.');
  }
  async getWatchListItems(): Promise<WatchListItem[]> {
    throw new Error('Method not implemented.');
  }
  async updateWatchListItem(watchListItem: WatchListItem): Promise<WatchListItem> {
    throw new Error('Method not implemented.');
  }
  async deleteWatchListItem(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getWatchListItemByUserIdAndAuctionitem_id(userId: number, auctionitem_id: number): Promise<WatchListItem> {
    throw new Error('Method not implemented.');
  }
}

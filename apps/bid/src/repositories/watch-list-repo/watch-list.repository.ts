import { Injectable, Logger } from '@nestjs/common';
import { WatchList } from '../../entities/watch-list.entity';
import { IWatchListRepository } from './watch-list.repository.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WatchListRepository
  extends Repository<WatchList>
  implements IWatchListRepository
{
  private readonly logger = new Logger(WatchListRepository.name);

  constructor(private dataSource: DataSource) {
    super(WatchList, dataSource.createEntityManager());
  }

  async createWatchList(watchList: WatchList): Promise<WatchList> {
    throw new Error('Method not implemented.');
  }
  async getWatchListById(id: number): Promise<WatchList> {
    throw new Error('Method not implemented.');
  }
  async getWatchLists(): Promise<WatchList[]> {
    throw new Error('Method not implemented.');
  }
  async updateWatchList(watchList: WatchList): Promise<WatchList> {
    throw new Error('Method not implemented.');
  }
  async deleteWatchList(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async getWatchListByUserId(userId: number): Promise<WatchList> {
    throw new Error('Method not implemented.');
  }
}

import { WatchList } from '../../entities/watch-list.entity';

export interface IWatchListRepository {
  createWatchList(watchList: WatchList): Promise<WatchList>;
  getWatchListById(id: number): Promise<WatchList>;
  getWatchLists(): Promise<WatchList[]>;
  updateWatchList(watchList: WatchList): Promise<WatchList>;
  deleteWatchList(id: number): Promise<void>;
  getWatchListByUserId(userId: number): Promise<WatchList>;
}

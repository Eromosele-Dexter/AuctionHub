import { WatchListItem } from '../../entities/watch-list-item.entity';

export interface IWatchListItemRepository {
  createWatchListItem(watchListItem: WatchListItem): Promise<WatchListItem>;
  getWatchListItemById(id: number): Promise<WatchListItem>;
  getWatchListItems(): Promise<WatchListItem[]>;
  updateWatchListItem(watchListItem: WatchListItem): Promise<WatchListItem>;
  deleteWatchListItem(id: number): Promise<void>;
  getWatchListItemsByUserId(userId: number): Promise<WatchListItem[]>;
  getWatchListItemByUserIdAndAuctionitem_id(userId: number, auctionitem_id: number): Promise<WatchListItem>;
}

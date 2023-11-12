import { ListingItem } from '../../entities/listing-item.entity';

export interface IListingItemRepository {
  createListingItem(listingItem: ListingItem): Promise<ListingItem>;
  getListingItemById(id: number): Promise<ListingItem>;
  getListingItems(): Promise<ListingItem[]>;
  updateListingItem(listingItem: ListingItem);
  deleteListingItem(id: number): Promise<void>;
}

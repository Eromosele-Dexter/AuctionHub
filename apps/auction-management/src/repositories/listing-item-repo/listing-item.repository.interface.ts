import { ListingItem } from '../../../../../libs/shared-library/src/entities/auction-management/listing-item.entity';

export interface IListingItemRepository {
  createListingItem(listingItem: ListingItem): Promise<ListingItem>;
  getListingItemById(id: number): Promise<ListingItem>;
  getListingItems(): Promise<ListingItem[]>;
  updateListingItem(listingItem: ListingItem, listing_item_id: number): Promise<ListingItem>;
  deleteListingItem(id: number): Promise<void>;
}

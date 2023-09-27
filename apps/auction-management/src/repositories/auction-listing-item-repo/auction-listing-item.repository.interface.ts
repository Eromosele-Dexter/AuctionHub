import { AuctionListingItem } from '../../entities/auction-listing-item.entity';

export interface IAuctionListingItemRepository {
  createAuctionListingItem(
    auctionListingItem: AuctionListingItem,
  ): Promise<AuctionListingItem>;

  getAuctionListingItemById(id: number): Promise<AuctionListingItem>;

  getAuctionListingItems(): Promise<AuctionListingItem[]>;

  updateAuctionListingItem(
    auctionListingItem: AuctionListingItem,
  ): Promise<AuctionListingItem>;

  deleteAuctionListingItem(id: number): Promise<void>;

  getAuctionListingItemsByAuctionListingId(
    auctionListingId: number,
  ): Promise<AuctionListingItem[]>;
}

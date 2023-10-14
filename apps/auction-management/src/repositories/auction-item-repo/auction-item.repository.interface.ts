import { AuctionItem } from '../../../../inventory/src/entities/auction-item.entity';

export interface IAuctionItemRepository {
  createAuctionItem(auctionItem: AuctionItem): Promise<AuctionItem>;
  getAuctionItemById(id: number): Promise<AuctionItem>;
  getAuctionItems(): Promise<AuctionItem[]>;
  updateAuctionItem(auctionItem: AuctionItem): Promise<AuctionItem>;
  deleteAuctionItem(id: number): Promise<void>;
}

import { Bid } from '../../entities/bid.entity';

export interface IBidRepository {
  createBid(bid: Bid): Promise<Bid>;
  getBidById(id: number): Promise<Bid>;
  getBids(): Promise<Bid[]>;
  updateBid(bid: Bid): Promise<Bid>;
  deleteBid(id: number): Promise<void>;
  getBidsByAuctionItemId(auctionItemId: number): Promise<Bid[]>;
  getHighestBidByAuctionItemId(auctionItemId: number): Promise<Bid>;
}

import { Bid } from '../../entities/bid.entity';

export interface IBidRepository {
  createBid(bid: Bid): Promise<Bid>;
  getBidById(id: number): Promise<Bid>;
  getBids(): Promise<Bid[]>;
  updateBid(bid: Bid): Promise<Bid>;
  deleteBid(id: number): Promise<void>;
  getBidsByAuctionitem_id(auctionitem_id: number): Promise<Bid[]>;
  getHighestBidByListingItem_id(auctionitem_id: number): Promise<Bid>;
}

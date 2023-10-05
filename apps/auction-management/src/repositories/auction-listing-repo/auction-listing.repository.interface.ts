import { AuctionListing } from '../../entities/auction-listing.entity';

export interface IAuctionListingRepository {
  createAuctionListing(auctionListing: AuctionListing): Promise<AuctionListing>;
  getAuctionListingById(id: number): Promise<AuctionListing>;
  getAuctionListings(): Promise<AuctionListing[]>;
  updateAuctionListing(auctionListing: AuctionListing): Promise<AuctionListing>;
  deleteAuctionListing(id: number): Promise<void>;
  getAuctionListingByUserId(userId: number): Promise<AuctionListing[]>;
}

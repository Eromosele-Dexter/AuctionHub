import { AuctionType } from '../../../../../libs/shared-library/src/entities/inventory/auction-type.entity';

export interface IAuctionTypeRepository {
  createAuctionType(auctionType: AuctionType): Promise<AuctionType>;
  getAuctionTypeById(id: number): Promise<AuctionType>;
  getAuctionTypes(): Promise<AuctionType[]>;
  deleteAuctionType(id: number): Promise<void>;
}

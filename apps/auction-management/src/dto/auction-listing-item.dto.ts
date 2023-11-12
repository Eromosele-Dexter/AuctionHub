import { IsInt, IsNotEmpty } from 'class-validator';

export class AuctionListingItemDto {
  @IsInt()
  _id: number;

  @IsInt()
  @IsNotEmpty()
  auctionListingId: number;

  @IsInt()
  @IsNotEmpty()
  item_id: number;
}

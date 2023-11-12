import { IsInt, IsNotEmpty } from 'class-validator';

export class AuctionListingDto {
  @IsInt()
  _id: number;

  @IsInt()
  @IsNotEmpty()
  seller_id: number;
}

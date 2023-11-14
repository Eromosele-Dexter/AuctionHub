import { IsNotEmpty, Max } from 'class-validator';

export class PlaceBidRequest {
  @IsNotEmpty()
  listing_item_id: number;

  @IsNotEmpty()
  bid_amount: number;

  @IsNotEmpty()
  bidder_id: number;
}

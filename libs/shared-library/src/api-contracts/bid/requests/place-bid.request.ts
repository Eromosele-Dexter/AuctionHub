import { IsNotEmpty, Max } from 'class-validator';

export class PlaceBidRequest {
  @IsNotEmpty()
  listing_item_id: number;

  @IsNotEmpty()
  @Max(100_000_000) // Max amount auction can be started at is 100 million
  bid_amount: number;

  @IsNotEmpty()
  bidder_id: number;
}

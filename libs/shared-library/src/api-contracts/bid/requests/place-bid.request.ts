import { IsNotEmpty } from 'class-validator';

export class PlaceBidRequest {
  @IsNotEmpty()
  auction_item_id: number;
  @IsNotEmpty()
  bid_amount: number;
  @IsNotEmpty()
  bidder_id: number;
}

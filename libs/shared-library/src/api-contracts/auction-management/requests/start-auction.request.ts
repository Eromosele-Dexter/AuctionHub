import { IsNotEmpty, IsNumber, Max } from 'class-validator';

export class StartAuctionRequest {
  @IsNotEmpty()
  end_time: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(100_000_000)
  starting_bid_price: number;

  @IsNumber()
  decrement_amount: number;
}

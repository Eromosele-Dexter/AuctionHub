import { IsNotEmpty, IsNumber } from 'class-validator';

export class StartAuctionRequest {
  @IsNotEmpty()
  end_time: number;

  @IsNotEmpty()
  @IsNumber()
  starting_bid_price: number;

  @IsNumber()
  decrement_amount: number;
}

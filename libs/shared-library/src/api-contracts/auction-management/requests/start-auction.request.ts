import { IsNotEmpty, IsNumber } from 'class-validator';

export class StartAuctionRequest {
  @IsNotEmpty()
  endTime: number;

  @IsNotEmpty()
  @IsNumber()
  startingBidPrice: number;

  @IsNumber()
  decrementAmount: number;
}

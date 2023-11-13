import { IsString, IsNotEmpty, Max } from 'class-validator';

export class CreateListingRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // @IsInt()
  // @IsNotEmpty()
  seller_id: number;

  // @IsNotEmpty()
  image: any;

  @IsString()
  keyword1: string;

  @IsString()
  keyword2: string;

  @IsString()
  keyword3: string;

  @IsNotEmpty()
  auctionType: string;

  @IsNotEmpty()
  @Max(100_000_000) // Max amount auction can be started at is 100 million
  starting_bid_price: number;

  @IsNotEmpty()
  end_time: number;

  decrement_amount: number;
}

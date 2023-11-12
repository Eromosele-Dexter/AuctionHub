import { IsNotEmpty, IsInt, IsNumber, IsOptional } from 'class-validator';

export class AuctionItemDto {
  // @IsInt()
  // _id: number;

  @IsInt()
  @IsNotEmpty()
  item_id: number;

  @IsInt()
  @IsNotEmpty()
  auction_type_id: number;

  @IsNumber()
  @IsNotEmpty()
  starting_bid_price: number;

  @IsNotEmpty()
  duration: number;

  @IsOptional()
  @IsInt()
  current_bid_price?: number;

  @IsOptional()
  @IsInt()
  decrement_amount?: number;
}

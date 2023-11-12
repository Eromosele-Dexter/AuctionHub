import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class BidDto {
  // @IsInt()
  // _id: number;

  @IsNotEmpty()
  @IsInt()
  bidderId: number;

  @IsNotEmpty()
  @IsInt()
  item_id: number;

  @IsNotEmpty()
  @IsNumber()
  bidAmount: number;

  @IsNotEmpty()
  created_at: number;
}

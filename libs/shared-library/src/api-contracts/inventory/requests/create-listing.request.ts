import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateListingRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // @IsInt()
  // @IsNotEmpty()
  sellerId: number;

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
}

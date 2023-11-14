import { IsNotEmpty } from 'class-validator';

export class CheckoutRequest {
  @IsNotEmpty()
  listing_item_id: number;

  @IsNotEmpty()
  bid_amount: number;
}

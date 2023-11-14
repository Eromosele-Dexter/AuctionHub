import { IsNotEmpty } from 'class-validator';

export class UpdateHasActiveBidRequest {
  @IsNotEmpty()
  listing_item_id: number;
}

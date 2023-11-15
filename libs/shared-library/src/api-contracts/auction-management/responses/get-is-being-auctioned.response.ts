import { CustomResponse } from '../../response.response';

export class GetIsListingItemBeingAuctionedResponse extends CustomResponse {
  constructor(
    public readonly data: { listing_item_id: number | null; item_is_being_auctioned: boolean },
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

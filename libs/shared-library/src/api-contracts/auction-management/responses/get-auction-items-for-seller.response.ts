import { AuctionItem } from 'apps/auction-management/src/entities/auction-item.entity'; // TODO: make exact replica of item.entity.ts in types in shared-library,
import { CustomResponse } from '../../response.response';

// do this for all the responses

export class GetAuctionItemsForSellerResponse extends CustomResponse {
  constructor(
    public readonly data: AuctionItem[],
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

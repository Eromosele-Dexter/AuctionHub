import { AuctionItem } from 'apps/auction-management/src/entities/auction-item.entity';
import { CustomResponse } from '../../response.response';

export class GetAuctionItemResponse extends CustomResponse {
  constructor(
    public readonly data: { auction_item: AuctionItem; has_been_sold: boolean },
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

import { AuctionItem } from 'apps/auction-management/src/entities/auction-item.entity';
import { CustomResponse } from '../../response.response';

export class PlaceBidResponse extends CustomResponse {
  constructor(
    public readonly data: AuctionItem,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

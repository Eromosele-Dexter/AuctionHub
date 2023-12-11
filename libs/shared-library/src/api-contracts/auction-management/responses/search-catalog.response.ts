import { AuctionItem } from '@app/shared-library/entities/auction-management/auction-item.entity';
import { CustomResponse } from '../../response.response';

export class SearchCatalogResponse extends CustomResponse {
  constructor(
    public readonly data: AuctionItem[],
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

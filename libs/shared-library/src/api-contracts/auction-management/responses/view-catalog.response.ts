import { AuctionItem } from '@app/shared-library/entities/auction-management/auction-item.entity';
import { CustomResponse } from '../../response.response';
import { CatalogItem } from '@app/shared-library/types/view-catalog-item'; // TODO: make exact replica of item.entity.ts in types in shared-library,
// do this for all the responses

export class ViewCatalogResponse extends CustomResponse {
  constructor(
    public readonly data: AuctionItem[],
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

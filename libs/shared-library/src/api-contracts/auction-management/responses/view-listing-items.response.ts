import { ListingItem } from '@app/shared-library/entities/auction-management/listing-item.entity';
import { CustomResponse } from '../../response.response';

export class ViewListingItemsResponse extends CustomResponse {
  constructor(
    public readonly data: ListingItem[],
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

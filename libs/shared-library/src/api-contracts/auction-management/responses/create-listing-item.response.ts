import { ListingItem } from 'apps/auction-management/src/entities/listing-item.entity';
import { CustomResponse } from '../../response.response';

export class CreateListingItemResponse extends CustomResponse {
  constructor(
    public readonly data: ListingItem,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

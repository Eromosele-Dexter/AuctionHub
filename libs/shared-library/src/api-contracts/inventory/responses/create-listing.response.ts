import { CustomResponse } from '../../response.response';
import { Item } from 'apps/inventory/src/entities/item.entity'; // TODO: make exact replica of item.entity.ts in types in shared-library,
// do this for all the responses

export class CreateListingResponse extends CustomResponse {
  constructor(
    public readonly item: Item,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(item, message, status, error);
  }
}

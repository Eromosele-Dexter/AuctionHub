import { CustomResponse } from '../../response.response';
import { Item } from '@app/shared-library/entities/inventory/item.entity'; // TODO: make exact replica of item.entity.ts in types in shared-library,
// do this for all the responses

export class CreateListingResponse extends CustomResponse {
  constructor(
    public readonly data: Item,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

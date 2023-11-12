import { ViewListingItem } from '@app/shared-library/types/view-listing-item'; // TODO: make exact replica of item.entity.ts in types in shared-library,
// do this for all the responses
import { CustomResponse } from '../../response.response';

export class ViewListingResponse extends CustomResponse {
  constructor(
    public readonly data: ViewListingItem[],
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

import { ActiveItem } from '@app/shared-library/types/active-item'; // TODO: make exact replica of item.entity.ts in types in shared-library,
// do this for all the responses
import { CustomResponse } from '../../response.response';

export class GetAllActiveItemsResponse extends CustomResponse {
  constructor(
    public readonly activeItems: ActiveItem[],
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(activeItems, message, status, error);
  }
}

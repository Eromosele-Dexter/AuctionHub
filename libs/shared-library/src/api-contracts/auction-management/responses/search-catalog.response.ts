import { CustomResponse } from '../../response.response';
import { CatalogItem } from '@app/shared-library/types/view-catalog-item'; // TODO: make exact replica of item.entity.ts in types in shared-library,
// do this for all the responses

export class SearchCatalogResponse extends CustomResponse {
  constructor(
    public readonly data: CatalogItem[],
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

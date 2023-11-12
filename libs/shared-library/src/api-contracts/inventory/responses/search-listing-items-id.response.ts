import { CustomResponse } from '../../response.response';

export class SearchForListingItemsIdByKeywordResponse extends CustomResponse {
  constructor(
    public readonly data: number[],
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

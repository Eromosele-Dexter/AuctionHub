import { CustomResponse } from '../../response.response';

export class GetAuctionTypeResponse extends CustomResponse {
  constructor(
    public readonly data: string,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

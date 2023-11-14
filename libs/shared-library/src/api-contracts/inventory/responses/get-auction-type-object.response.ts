import { AuctionType } from 'apps/inventory/src/entities/auction-type.entity';
import { CustomResponse } from '../../response.response';

export class GetAuctionTypeObjectResponse extends CustomResponse {
  constructor(
    public readonly data: AuctionType,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

import { AuctionType } from '@app/shared-library/entities/inventory/auction-type.entity';
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

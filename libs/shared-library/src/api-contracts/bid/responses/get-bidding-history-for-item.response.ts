import { BiddingHistoryItem } from '@app/shared-library/types/bidding-history';
import { CustomResponse } from '../../response.response';

export class ViewBiddingHistoryResponse extends CustomResponse {
  constructor(
    public readonly data: BiddingHistoryItem[],
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

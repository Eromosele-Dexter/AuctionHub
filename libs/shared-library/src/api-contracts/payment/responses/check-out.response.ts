import { CheckOutItem } from '@app/shared-library/types/check-out-item';
import { CustomResponse } from '../../response.response';

export class CheckOutItemResponse extends CustomResponse {
  constructor(
    public readonly data: CheckOutItem,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

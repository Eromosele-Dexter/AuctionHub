import { User } from '@app/shared-library/entities/auth/user.entity';
import { CustomResponse } from '../../response.response';

export class GetSingleUserResponse extends CustomResponse {
  constructor(
    public readonly data: User,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

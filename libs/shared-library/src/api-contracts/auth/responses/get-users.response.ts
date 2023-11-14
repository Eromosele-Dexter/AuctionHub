import { User } from 'apps/auth/src/entities/user.entity';
import { CustomResponse } from '../../response.response';

export class GetUsersResponse extends CustomResponse {
  constructor(
    public readonly data: User[],
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    super(data, message, status, error);
  }
}

import { User } from 'apps/auth/src/entities/user.entity';
import { CustomResponse } from '../../response.response';

export class ResetPasswordResponse extends CustomResponse {
  constructor(
    public readonly data: User,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    let user = null;
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = data;
      user = result;
    }
    super(user, message, status, error);
  }
}

import { User } from 'apps/auth/src/entities/user.entity';
import { CustomResponse } from '../../response.response';

export class ResetPasswordResponse extends CustomResponse {
  constructor(
    public readonly user: User,
    public readonly message: string,
    public readonly status: string,
    public readonly error?: string,
  ) {
    let data = null;
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      data = result;
    }
    super(data, message, status, error);
  }
}

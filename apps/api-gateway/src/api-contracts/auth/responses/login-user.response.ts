import { User } from 'apps/auth/src/entities/user.entity';

export class LoginUserResponse {
  constructor(public readonly user: User) {}

  toString() {
    return JSON.stringify(this.user, null, 2);
  }
}

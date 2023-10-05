import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repo/user.repository';
import { SessionRepository } from '../repositories/session-repo/session.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
}

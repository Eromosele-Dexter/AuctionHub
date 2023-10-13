import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repo/user.repository';
import { SessionRepository } from '../repositories/session-repo/session.repository';
import { User } from '../entities/user.entity';
import { ROLES, STATUS } from '@app/shared-library/types';
import { LoginUserResponse, RegisterUserResponse } from '@app/shared-library';
import * as bcrypt from 'bcrypt';
import RegisterUserMessage from '@app/shared-library/messages/register-user.message';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async handleRegisterUser(registerUserMessage: RegisterUserMessage): Promise<RegisterUserResponse> {
    const user = new User(
      registerUserMessage.firstName,
      registerUserMessage.lastName,
      registerUserMessage.username,
      registerUserMessage.password,
      registerUserMessage.email,
      registerUserMessage.isSeller ? ROLES.SELLER : ROLES.BUYER,
      registerUserMessage.streetName,
      registerUserMessage.streetNumber,
      registerUserMessage.postalCode,
      registerUserMessage.city,
      registerUserMessage.country,
      registerUserMessage.dateRegistered,
    );

    const userExists = await this.userRepository.getUserByUsername(user.username);

    if (userExists) {
      return new RegisterUserResponse(
        null,
        `User with username '${user.username}' already exists`,
        STATUS.FAILED,
        'Error registering user',
      );
    }

    this.userRepository.createUser(user);

    return new RegisterUserResponse(user, 'User created', STATUS.SUCCESS);
  }

  async validateUser(username: string, password: string): Promise<LoginUserResponse> {
    const user: User = await this.userRepository.getUserByUsername(username);
    // const isMatch = await bcrypt.compare(password, user.password);
    if (user && user.password === password) {
      // TODO: use bcrypt to compare passwords instead
      return new LoginUserResponse(user, 'User validated', STATUS.SUCCESS);
    }

    return new LoginUserResponse(null, "User doesn't exist", STATUS.FAILED, 'Error validating user');
  }
}

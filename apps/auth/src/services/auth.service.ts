import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repo/user.repository';
import { SessionRepository } from '../repositories/session-repo/session.repository';
import RegisterUserEvent from '@app/shared-library/events/register-user.event';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  handleRegisterUser(registerUserEvent: RegisterUserEvent) {
    console.log('Auth Service Registering: ', JSON.stringify(registerUserEvent, null, 2));

    const user = new User(
      registerUserEvent.firstName,
      registerUserEvent.lastName,
      registerUserEvent.username,
      registerUserEvent.password,
      registerUserEvent.email,
      registerUserEvent.isSeller ? 'seller' : 'buyer',
      registerUserEvent.streetName,
      registerUserEvent.streetNumber,
      registerUserEvent.postalCode,
      registerUserEvent.city,
      registerUserEvent.country,
      registerUserEvent.dateRegistered,
    );

    this.userRepository.createUser(user);
    this.userRepository.getUserById(4).then((user) => {
      console.log('User: ', JSON.stringify(user, null, 2));
    });

    return {
      token: 'Dexter123345',
    };
  }
}

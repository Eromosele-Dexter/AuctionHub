import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AppService } from '../services/app.service';
import { LoginUserRequest } from '../../../../libs/shared-library/src/api-contracts/auth/requests/login-user.request';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private appService: AppService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const loginUserRequest: LoginUserRequest = { username, password };
    const user = await this.appService.validateUser(loginUserRequest);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

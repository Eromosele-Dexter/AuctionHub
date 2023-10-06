import { Controller, Get, Post, HttpStatus, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '../../services/app.service';
import { RegisterUserRequest } from '../../api-contracts/auth/requests/register-user.request';
import { formatResponse } from '../../utils/formatResponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // user register - auth service

  @Post('/register')
  async registerUser(@Body() registerUserRequest: RegisterUserRequest, @Res() response: Response) {
    try {
      const data = await this.appService.registerUser(registerUserRequest);

      return formatResponse(response, HttpStatus.OK, 'Registration successful', data);
    } catch (error) {
      return formatResponse(response, HttpStatus.BAD_REQUEST, 'Registration failed', error.message);
    }
  }

  // user login

  // user logout

  // view catalog and search

  // view item

  // view bidding history

  // reset password

  // edit profile

  // auction for item ended
}

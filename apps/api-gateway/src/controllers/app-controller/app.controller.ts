import { Controller, Get, Post, HttpStatus, Res, Body, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '../../services/app.service';
import { RegisterUserRequest } from '../../api-contracts/auth/requests/register-user.request';
import { formatResponse } from '../../utils/formatResponse';
import { LoginUserRequest } from '../../api-contracts/auth/requests/login-user.request';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // user register - auth service

  @Post('/register')
  async registerUser(@Body() registerUserRequest: RegisterUserRequest, @Res() response: Response) {
    try {
      const data = await this.appService.registerUser(registerUserRequest);

      return formatResponse(response, 'Registration', data);
    } catch (error) {
      return formatResponse(response, 'Registration', error.message);
    }
  }

  // user login
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Request() loginUserRequest, @Res() response: Response): Promise<any> {
    try {
      const data = loginUserRequest.user;

      return formatResponse(response, 'Login', data);
    } catch (error) {
      return formatResponse(response, 'Login', error.message);
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/hello')
  async hello(@Request() req): Promise<any> {
    try {
      console.log('req: ', req.user);
      return 'hello';
      // return formatResponse(response, 'Hello', 'Hello');
    } catch (error) {
      return formatResponse(req, 'Hello', error.message);
    }
  }

  // user logout
  @UseGuards(AuthenticatedGuard)
  @Post('/logout')
  async logoutUser(@Res() response: Response) {
    try {
      const data = await this.appService.logoutUser();

      return formatResponse(response, 'Logout', data);
    } catch (error) {
      return formatResponse(response, 'Logout', error.message);
    }
  }

  // reset password // protected route
  @Post('/reset-password')
  async resetPassword(@Res() response: Response) {
    try {
      const data = await this.appService.resetPassword();

      return formatResponse(response, 'Password reset', data);
    } catch (error) {
      return formatResponse(response, 'Password reset', error.message);
    }
  }

  // view catalog and search
  @UseGuards(AuthenticatedGuard)
  @Get('/catalog')
  async viewCatalog(@Res() response: Response) {
    try {
      const data = await this.appService.viewCatalog();

      return formatResponse(response, 'Catalog', data);
    } catch (error) {
      return formatResponse(response, 'Catalog', error.message);
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/catalog/:search')
  async searchCatalog(@Res() response: Response) {
    try {
      const data = await this.appService.searchCatalog();

      return formatResponse(response, 'Catalog', data);
    } catch (error) {
      return formatResponse(response, 'Catalog', error.message);
    }
  }

  // view item
  @UseGuards(AuthenticatedGuard)
  @Get('/item/:id')
  async viewItem(@Res() response: Response) {
    try {
      const data = await this.appService.viewItem();

      return formatResponse(response, 'Item', data);
    } catch (error) {
      return formatResponse(response, 'Item', error.message);
    }
  }

  // view bidding history
  @UseGuards(AuthenticatedGuard)
  @Get('/bidding-history')
  async viewBiddingHistory(@Res() response: Response) {
    try {
      const data = await this.appService.viewBiddingHistory();

      return formatResponse(response, 'Bidding history', data);
    } catch (error) {
      return formatResponse(response, 'Bidding history', error.message);
    }
  }

  // edit profile
  @UseGuards(AuthenticatedGuard)
  @Post('/edit-profile')
  async editProfile(@Res() response: Response) {
    try {
      const data = await this.appService.editProfile();

      return formatResponse(response, 'Profile edited', data);
    } catch (error) {
      return formatResponse(response, 'Profile edit', error.message);
    }
  }

  @UseGuards(AuthenticatedGuard)
  // auction for item ended
  @Post('/auction-ended')
  async auctionEnded(@Res() response: Response) {
    try {
      const data = await this.appService.auctionEnded();

      return formatResponse(response, 'Auction ended', data);
    } catch (error) {
      return formatResponse(response, 'Auction end', error.message);
    }
  }
}

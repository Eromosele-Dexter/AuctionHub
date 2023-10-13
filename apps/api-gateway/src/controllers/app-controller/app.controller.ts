import { Controller, Get, Post, HttpStatus, Res, Body, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '../../services/app.service';
import { RegisterUserRequest } from '../../../../../libs/shared-library/src/api-contracts/auth/requests/register-user.request';
import { formatResponse } from '../../utils/formatResponse';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';
import { SendValidationCodeRequest } from '@app/shared-library';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // user register - auth service

  @Post('/register')
  async registerUser(@Body() registerUserRequest: RegisterUserRequest, @Res() response: Response) {
    const data = await this.appService.registerUser(registerUserRequest);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
  }

  // user login - auth service

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Request() loginUserRequest, @Res() response: Response): Promise<any> {
    const data = loginUserRequest.user;

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
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
  async logoutUser(@Request() logoutUserRequest, @Res() response: Response) {
    // Destroy the session to log the user out
    logoutUserRequest.session.destroy((err) => {
      if (err) {
        console.error(err);
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Logout failed' });
      }
      return response.status(HttpStatus.OK).json({ message: 'Logout successful' });
    });
  }

  @Post('/send-validation-code')
  sendValidationCode(@Body() sendValidationCodeRequest: SendValidationCodeRequest, @Res() response: Response) {
    this.appService.sendValidationCode(sendValidationCodeRequest);

    return response.status(HttpStatus.OK).json({ message: 'Sending validation code successful' });
  }

  // reset password - auth service
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

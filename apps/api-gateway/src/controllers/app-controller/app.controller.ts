import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Res,
  Body,
  UseGuards,
  Request,
  Req,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '../../services/app.service';
import { RegisterUserRequest } from '../../../../../libs/shared-library/src/api-contracts/auth/requests/register-user.request';
import { formatResponse } from '../../utils/formatResponse';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';
import { LoginUserRequest, ResetPasswordRequest, SendValidationCodeRequest } from '@app/shared-library';
import { EditProfileRequest } from '@app/shared-library/api-contracts/auth/requests/edit-profile.request';

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
    return response.status(HttpStatus.CREATED).json(data);
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

  // send validation code - auth service

  @Post('/send-validation-code')
  sendValidationCode(@Body() sendValidationCodeRequest: SendValidationCodeRequest, @Res() response: Response) {
    try {
      this.appService.sendValidationCode(sendValidationCodeRequest);
    } catch (error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Sending validation code failed', error });
    }

    return response.status(HttpStatus.OK).json({ message: 'Sending validation code successful' });
  }

  // reset password - auth service

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordRequest: ResetPasswordRequest, @Res() response: Response) {
    const data = await this.appService.resetPassword(resetPasswordRequest);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
  }

  // view catalog -  auction management service

  @UseGuards(AuthenticatedGuard)
  @Get('/catalog')
  async viewCatalog(@Request() req, @Res() response: Response) {
    const data = await this.appService.viewCatalog(req.user.id);

    if (data?.error || !data) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
  }

  // search catalog - auction management service

  @UseGuards(AuthenticatedGuard)
  @Get('/search-catalog')
  async searchCatalog(@Query('searchkeyword') searchkeyword: string, @Res() response: Response) {
    const data = await this.appService.searchCatalog(searchkeyword);

    if (data?.error || !data) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
  }

  // // view item
  // @UseGuards(AuthenticatedGuard)
  // @Get('/item/:id')
  // async viewItem(@Param('id') id: number, @Res() response: Response) {
  //   try {
  //     const data = await this.appService.viewItem();

  //     return formatResponse(response, 'Item', data);
  //   } catch (error) {
  //     return formatResponse(response, 'Item', error.message);
  //   }
  // }

  // view bidding history - bid service
  @UseGuards(AuthenticatedGuard)
  @Get('/view-bidding-history')
  async viewBiddingHistory(@Res() response: Response) {
    // try {
    //   const data = await this.appService.viewBiddingHistory();
    //   return formatResponse(response, 'Bidding history', data);
    // } catch (error) {
    //   return formatResponse(response, 'Bidding history', error.message);
    // }
  }

  // edit profile - auth service
  @UseGuards(AuthenticatedGuard)
  @Patch('/edit-profile')
  async editProfile(@Body() editProfileRequest: EditProfileRequest, @Request() req, @Res() response: Response) {
    const userId = req.user.id;

    const data = await this.appService.editProfile(userId, editProfileRequest);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }

  // @UseGuards(AuthenticatedGuard) // convert to service worker or websockets
  // // auction for item ended
  // @Post('/auction-ended')
  // async auctionEnded(@Res() response: Response) {
  //   try {
  //     const data = await this.appService.auctionEnded();

  //     return formatResponse(response, 'Auction ended', data);
  //   } catch (error) {
  //     return formatResponse(response, 'Auction end', error.message);
  //   }
  // }
}

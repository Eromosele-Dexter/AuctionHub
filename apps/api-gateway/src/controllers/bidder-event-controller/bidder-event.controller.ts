import { Controller, Get, HttpStatus, Post, Res, Request, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { BidderEventService } from '../../services/bidder-event.service';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';

@Controller()
export class BidderEventController {
  constructor(private readonly bidderService: BidderEventService) {}

  // place bid - bid service this a fallback method for websocket

  @UseGuards(AuthenticatedGuard)
  @Post('/bid')
  async placeBid(@Request() req) {
    // try {
    //   const sessionData = req.session;
    //   sessionData.hasActiveBid = true;
    //   sessionData.biditem_id = req.body.biditem_id;
    //   req.session.save();
    //   return req.session;
    // } catch (error) {
    //   return formatResponse(req, 'Bido', error.message);
    // }
  }

  // view watchlist - bid service
  @UseGuards(AuthenticatedGuard)
  @Get('/view-watchlist')
  async viewWatchList(@Request() req, @Res() response: Response) {
    const data = await this.bidderService.viewWatchList(req.user.id);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }

  // checkout  - payment service
  @UseGuards(AuthenticatedGuard)
  @Post('/checkout')
  async checkout(@Request() req, @Res() response: Response) {
    const data = await this.bidderService.checkout(req.user.id);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }
}

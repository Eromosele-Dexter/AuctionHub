import { Body, Controller, Get, HttpStatus, Post, Res, Request, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '../../services/app.service';
import { BidderEventService } from '../../services/bidder-event.service';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';
import { formatResponse } from '../../utils/formatResponse';

@Controller()
export class BidderEventController {
  constructor(private readonly bidderService: BidderEventService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // place bid // protected route

  @UseGuards(AuthenticatedGuard)
  @Get('/bid')
  async bid(@Request() req): Promise<any> {
    // try {
    //   const sessionData = req.session;
    //   sessionData.hasActiveBid = true;
    //   sessionData.bidItemId = req.body.bidItemId;
    //   req.session.save();
    //   return req.session;
    // } catch (error) {
    //   return formatResponse(req, 'Bido', error.message);
    // }
  }

  // checkout // protected route

  // receipt // protected route

  // view watchlist // protected route
}

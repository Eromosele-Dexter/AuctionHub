import { Controller, Get } from '@nestjs/common';
import { AppService } from '../../services/app.service';
import { BidderEventService } from '../../services/bidder-event.service';

@Controller()
export class BidderEventController {
  constructor(private readonly appService: BidderEventService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // place bid // protected route

  // checkout // protected route

  // receipt // protected route

  // view watchlist // protected route
}

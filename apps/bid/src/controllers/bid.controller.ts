import { Controller, Get } from '@nestjs/common';
import { BidService } from '../services/bid.service';

@Controller()
export class BidController {
  constructor(private readonly bidService: BidService) {}

  // @Get()
  // getHello(): string {
  //   return this.bidService.getHello();
  // }
}

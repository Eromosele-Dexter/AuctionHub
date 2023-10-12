import { Controller, Get } from '@nestjs/common';
import { AppService } from '../../services/app.service';
import { SellerEventService } from '../../services/seller-event.service';

@Controller()
export class SellerEventController {
  constructor(private readonly appService: SellerEventService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // create a listing  // protected route

  // start an auction  // protected route

  // view item listing // protected route
}

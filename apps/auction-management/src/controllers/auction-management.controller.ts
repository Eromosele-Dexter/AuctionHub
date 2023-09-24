import { Controller, Get } from '@nestjs/common';
import { AuctionManagementService } from '../services/auction-management.service';

@Controller()
export class AuctionManagementController {
  constructor(
    private readonly auctionManagementService: AuctionManagementService,
  ) {}

  @Get()
  getHello(): string {
    return this.auctionManagementService.getHello();
  }
}

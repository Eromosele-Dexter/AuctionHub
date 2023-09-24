import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionManagementService {
  getHello(): string {
    return 'Hello World!';
  }
}

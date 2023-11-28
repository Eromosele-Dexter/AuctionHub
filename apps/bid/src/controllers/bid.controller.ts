import { Controller, Get } from '@nestjs/common';
import { BidService } from '../services/bid.service';
import { RmqService, GET_BID_HISTORY_MESSAGE_PATTERN, VIEW_WATCH_LIST_MESSAGE_PATTERN } from '@app/shared-library';
import ViewBiddingHistoryMessage from '@app/shared-library/messages/get-bidding-history.message';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import ViewWatchListMessage from '@app/shared-library/messages/view-watch-list.message';

@Controller()
export class BidController {
  constructor(
    private readonly bidService: BidService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(GET_BID_HISTORY_MESSAGE_PATTERN)
  async handleViewBiddingHistory(@Payload() data: ViewBiddingHistoryMessage, @Ctx() context: RmqContext) {
    const listingItem = await this.bidService.handleViewBiddingHistory(data);
    this.rmqService.ack(context);
    return listingItem;
  }

  @MessagePattern(VIEW_WATCH_LIST_MESSAGE_PATTERN)
  async handleViewWatchList(@Payload() data: ViewWatchListMessage, @Ctx() context: RmqContext) {
    const listingItem = await this.bidService.handleViewWatchList(data);
    this.rmqService.ack(context);
    return listingItem;
  }
}

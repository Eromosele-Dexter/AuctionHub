import { Controller, Get, HttpStatus, Post, Res, Request, UseGuards, Param, Body } from '@nestjs/common';
import { Response } from 'express';
import { BidderEventService } from '../../services/bidder-event.service';
import { AuthenticatedGuard } from '../../guards/authenticated.guard';
import { UpdateHasActiveBidRequest } from '@app/shared-library/api-contracts/api-gateway/requests/update-has-active-bid.request';
import { CheckoutRequest } from '@app/shared-library/api-contracts/payment/requests/check-out.request';

@Controller()
export class BidderEventController {
  constructor(private readonly bidderService: BidderEventService) {}

  @Post('/retrieve-session/:bidSessionId')
  async retrieveSession(@Param('bidSessionId') bidSessionId: string, @Res() response: Response) {
    const data = await this.bidderService.handleRetrieveSession(bidSessionId);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }

  @Post('/bid/:bidSessionId')
  async placeBid(
    @Param('bidSessionId') bidSessionId: string,
    @Request() updateHasActiveBidRequest: UpdateHasActiveBidRequest,
    @Res() response: Response,
  ) {
    const data = await this.bidderService.updateHasActiveBid(updateHasActiveBidRequest, bidSessionId);

    return response.status(HttpStatus.CREATED).json(data);
  }

  // view watchlist - bid service
  @UseGuards(AuthenticatedGuard)
  @Get('/view-watchlist')
  async viewWatchList(@Request() req, @Res() response: Response) {
    const data = await this.bidderService.handleViewWatchList(req.user.id);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }

  // view bidding history - bid service
  @UseGuards(AuthenticatedGuard)
  @Get('/view-bidding-history/:listingItemId')
  async viewBiddingHistory(@Param('listingItemId') listing_item_id: number, @Res() response: Response) {
    const data = await this.bidderService.handleViewBiddingHistory(listing_item_id);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/sell-item:listingItemId')
  async sellAuctionItem(
    @Param('listingItemId') listing_item_id: number,
    @Request() req,
    @Res() response: Response,
  ) {
    const data = await this.bidderService.sellAuctionItem(listing_item_id);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }

  // checkout  - payment service
  @UseGuards(AuthenticatedGuard)
  @Post('/checkout')
  async checkout(@Body() checkoutRequest: CheckoutRequest, @Request() req, @Res() response: Response) {
    const data = await this.bidderService.checkout(req.user.id, checkoutRequest);

    if (data?.error || !data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }
}

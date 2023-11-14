export class BiddingHistoryItem {
  bidder_name: string;
  bid_amount: number;
  created_at: number;

  constructor(bidder_name: string, bid_amount: number, created_at: number) {
    this.bidder_name = bidder_name;
    this.bid_amount = bid_amount;
    this.created_at = created_at;
  }
}

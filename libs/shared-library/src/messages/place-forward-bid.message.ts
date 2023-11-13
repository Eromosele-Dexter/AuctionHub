class PlaceForwardBidMessage {
  constructor(
    public readonly bidder_id: number,
    public readonly listing_item_id: number,
    public readonly auction_item_id: number,
    public readonly bid_amount: number,
  ) {}

  toString() {
    return JSON.stringify({
      bidder_id: this.bidder_id,
      listing_item_id: this.listing_item_id,
      auction_item_id: this.auction_item_id,
      bid_amount: this.bid_amount,
    });
  }
}

export default PlaceForwardBidMessage;

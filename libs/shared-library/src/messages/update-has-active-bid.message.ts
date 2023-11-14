class UpdateHasActiveBidMessage {
  constructor(
    public readonly listing_item_id: number,
    public readonly bidder_id: number,
  ) {}

  toString() {
    return JSON.stringify({
      listing_item_id: this.listing_item_id,
      bidder_id: this.bidder_id,
    });
  }
}

export default UpdateHasActiveBidMessage;

class ViewBiddingHistoryMessage {
  constructor(public readonly listing_item_id: number) {}

  toString() {
    return JSON.stringify({
      listing_item_id: this.listing_item_id,
    });
  }
}

export default ViewBiddingHistoryMessage;

class StartAuctionEvent {
  constructor(
    public readonly listing_item_id: number,
    public readonly seller_id: number,
  ) {}

  toString() {
    return JSON.stringify({
      listing_item_id: this.listing_item_id,
      seller_id: this.seller_id,
    });
  }
}

export default StartAuctionEvent;

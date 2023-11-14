class CheckOutItemMessage {
  constructor(
    public readonly listing_item_id: number,
    public readonly user_id: number,
    public readonly bid_amount: number,
  ) {}

  toString() {
    return JSON.stringify({
      listing_item_id: this.listing_item_id,
      user_id: this.user_id,
      bid_amount: this.bid_amount,
    });
  }
}

export default CheckOutItemMessage;

class CheckOutItemMessage {
  constructor(
    public readonly listing_item_id: number,
    public readonly user_id: number,
  ) {}

  toString() {
    return JSON.stringify({
      listing_item_id: this.listing_item_id,
      user_id: this.user_id,
    });
  }
}

export default CheckOutItemMessage;

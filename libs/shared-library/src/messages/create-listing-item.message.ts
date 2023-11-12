class CreateListingItemMessage {
  constructor(
    public readonly name: string,
    public readonly item_id: number,
    public readonly seller_id: number,
    public readonly starting_bid_price: number,
    public readonly description: string,
    public readonly image_name: string,
    public readonly image_url: string,
    public readonly auction_type_id: number,
    public readonly end_time: number,
    public readonly decrement_amount: number,
    public readonly created_at: number,
    public readonly has_been_sold: boolean,
  ) {}

  toString() {
    return JSON.stringify({
      name: this.name,
      item_id: this.item_id,
      seller_id: this.seller_id,
      starting_bid_price: this.starting_bid_price,
      description: this.description,
      image_name: this.image_name,
      image_url: this.image_url,
      auction_type_id: this.auction_type_id,
      end_time: this.end_time,
      decrement_amount: this.decrement_amount,
      created_at: this.created_at,
      has_been_sold: this.has_been_sold,
    });
  }
}

export default CreateListingItemMessage;

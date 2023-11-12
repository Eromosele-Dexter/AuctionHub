class CreateListingEvent {
  constructor(
    public readonly seller_id: number,

    public readonly name: string,

    public readonly description: string,

    public readonly image_name: string,

    public readonly image_url: string,

    public readonly created_at: number,

    public readonly auctionType: string,

    public readonly keyword1: string,

    public readonly keyword2: string,

    public readonly keyword3: string,

    public readonly starting_bid_price: number,

    public readonly end_time: number,

    public readonly decrement_amount: number,
  ) {}

  toString() {
    return JSON.stringify({
      seller_id: this.seller_id,
      name: this.name,
      description: this.description,
      image_name: this.image_name,
      image_url: this.image_url,
      created_at: this.created_at,
      auctionType: this.auctionType,
      keyword1: this.keyword1,
      keyword2: this.keyword2,
      keyword3: this.keyword3,
      starting_bid_price: this.starting_bid_price,
      end_time: this.end_time,
      decrement_amount: this.decrement_amount,
    });
  }
}

export default CreateListingEvent;

class CreateListingEvent {
  constructor(
    public readonly sellerId: number,

    public readonly name: string,

    public readonly description: string,

    public readonly imageName: string,

    public readonly imageUrl: string,

    public readonly created_at: Date,

    public readonly auctionType: string,

    public readonly keyword1: string,

    public readonly keyword2: string,

    public readonly keyword3: string,

    public readonly startingBidPrice: number,

    public readonly endTime: Date,

    public readonly decrementAmount: number,
  ) {}

  toString() {
    return JSON.stringify({
      sellerId: this.sellerId,
      name: this.name,
      description: this.description,
      imageName: this.imageName,
      imageUrl: this.imageUrl,
      created_at: this.created_at,
      auctionType: this.auctionType,
      keyword1: this.keyword1,
      keyword2: this.keyword2,
      keyword3: this.keyword3,
      startingBidPrice: this.startingBidPrice,
      endTime: this.endTime,
      decrementAmount: this.decrementAmount,
    });
  }
}

export default CreateListingEvent;

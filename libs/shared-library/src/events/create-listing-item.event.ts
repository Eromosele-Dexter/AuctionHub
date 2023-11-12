class CreateListingItemEvent {
  constructor(
    public readonly name: string,
    public readonly itemId: number,
    public readonly sellerId: number,
    public readonly startingBidPrice: number,
    public readonly description: string,
    public readonly imageName: string,
    public readonly imageUrl: string,
    public readonly auctionTypeId: number,
    public readonly endTime: Date,
    public readonly decrementAmount: number,
    public readonly created_at: Date,
    public readonly hasBeenSold: boolean,
  ) {}

  toString() {
    return JSON.stringify({
      name: this.name,
      itemId: this.itemId,
      sellerId: this.sellerId,
      startingBidPrice: this.startingBidPrice,
      description: this.description,
      imageName: this.imageName,
      imageUrl: this.imageUrl,
      auctionTypeId: this.auctionTypeId,
      endTime: this.endTime,
      decrementAmount: this.decrementAmount,
      created_at: this.created_at,
      hasBeenSold: this.hasBeenSold,
    });
  }
}

export default CreateListingItemEvent;

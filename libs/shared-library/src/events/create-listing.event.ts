class CreateListingEvent {
  constructor(
    public readonly sellerId: number,

    public readonly name: string,

    public readonly description: string,

    public readonly imageName: string,

    public readonly imageUrl: string,

    public readonly createdAt: Date,

    public readonly auctionType: string,

    public readonly keyword1: string,

    public readonly keyword2: string,

    public readonly keyword3: string,
  ) {}

  toString() {
    return JSON.stringify({
      sellerId: this.sellerId,
      name: this.name,
      description: this.description,
      imageName: this.imageName,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      auctionType: this.auctionType,
      keyword1: this.keyword1,
      keyword2: this.keyword2,
      keyword3: this.keyword3,
    });
  }
}

export default CreateListingEvent;

class StartAuctionEvent {
  constructor(
    public readonly itemId: number,
    public readonly sellerId: number,
    public readonly endTime: number,
    public readonly startingBidPrice: number,
    public readonly decrementAmount: number,
  ) {}

  toString() {
    return JSON.stringify({
      itemId: this.itemId,
      sellerId: this.sellerId,
      endTime: this.endTime,
      startingBidPrice: this.startingBidPrice,
      decrementAmount: this.decrementAmount,
    });
  }
}

export default StartAuctionEvent;

class StartAuctionMessage {
  constructor(public readonly itemId: number) {}

  toString() {
    return JSON.stringify({
      itemId: this.itemId,
    });
  }
}

export default StartAuctionMessage;

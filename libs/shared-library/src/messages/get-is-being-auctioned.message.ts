class GetIsBeingAuctionedMessage {
  constructor(public readonly item_id: number) {}

  toString() {
    return JSON.stringify({
      item_id: this.item_id,
    });
  }
}

export default GetIsBeingAuctionedMessage;

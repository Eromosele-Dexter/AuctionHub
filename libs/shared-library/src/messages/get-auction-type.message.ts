class GetAuctionTypeMessage {
  constructor(public readonly auction_type_id: number) {}

  toString() {
    return JSON.stringify({
      auction_type_id: this.auction_type_id,
    });
  }
}

export default GetAuctionTypeMessage;

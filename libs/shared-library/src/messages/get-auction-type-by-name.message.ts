class GetAuctionItemsByAuctionTypeMessage {
  constructor(public readonly auction_type_name: string) {}

  toString() {
    return JSON.stringify({
      auction_type_name: this.auction_type_name,
    });
  }
}

export default GetAuctionItemsByAuctionTypeMessage;

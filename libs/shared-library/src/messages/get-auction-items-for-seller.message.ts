class GetAuctionItemsForSellerMessage {
  constructor(public readonly seller_id: number) {}

  toString() {
    return JSON.stringify({
      seller_id: this.seller_id,
    });
  }
}

export default GetAuctionItemsForSellerMessage;

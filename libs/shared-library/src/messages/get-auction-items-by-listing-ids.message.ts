class GetAuctionItemsByListingItemsIdsMessage {
  constructor(public readonly listing_item_ids: number[]) {}

  toString() {
    return JSON.stringify({
      listing_item_ids: this.listing_item_ids,
    });
  }
}

export default GetAuctionItemsByListingItemsIdsMessage;

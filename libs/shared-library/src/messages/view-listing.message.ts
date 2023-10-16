class ViewListingMessage {
  constructor(public readonly sellerId: number) {}

  toString() {
    return JSON.stringify({
      sellerId: this.sellerId,
    });
  }
}

export default ViewListingMessage;

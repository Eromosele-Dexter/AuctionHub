class GetListingItemMessage {
  constructor(
    public readonly name: string,
    public readonly seller_id: number,
  ) {}

  toString() {
    return JSON.stringify({
      name: this.name,
      seller_id: this.seller_id,
    });
  }
}

export default GetListingItemMessage;

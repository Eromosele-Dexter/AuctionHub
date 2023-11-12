class SearchForListingItemsIdByKeywordMessage {
  constructor(public readonly keyword: string) {}

  toString() {
    return JSON.stringify({
      keyword: this.keyword,
    });
  }
}

export default SearchForListingItemsIdByKeywordMessage;

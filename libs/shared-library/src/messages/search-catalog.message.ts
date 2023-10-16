class SearchCatalogMessage {
  constructor(public readonly searchKeyword: string) {}

  toString() {
    return JSON.stringify({
      searchKeyword: this.searchKeyword,
    });
  }
}

export default SearchCatalogMessage;

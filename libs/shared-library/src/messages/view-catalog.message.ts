class ViewCatalogMessage {
  constructor(public readonly userId: number) {}

  toString() {
    return JSON.stringify({
      userId: this.userId,
    });
  }
}

export default ViewCatalogMessage;

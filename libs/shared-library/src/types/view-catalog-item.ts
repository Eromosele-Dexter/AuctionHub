export class CatalogItem {
  itemId: number; // itemId

  name: string;

  description: string;

  imageName: string;

  auctionType: string;

  endTime: number;

  currentBidPrice: number;

  imageUrl: string;

  constructor(
    itemId: number, // itemId
    name: string,
    description: string,
    imageName: string,
    auctionType: string,
    endTime: number,
    currentBidPrice: number,
    imageUrl?: string,
  ) {
    this.itemId = itemId;
    this.name = name;
    this.description = description;
    this.imageName = imageName;
    this.auctionType = auctionType;
    this.endTime = endTime;
    this.currentBidPrice = currentBidPrice;
    this.imageUrl = imageUrl;
  }
}

export class ViewListingItem {
  itemId: number; // itemId

  name: string;

  description: string;

  imageName: string;

  auctionType: string;

  status: string;

  endTime: number;

  currentBidPrice: number;

  imageUrl: string;

  constructor(
    itemId: number, // itemId
    name: string,
    description: string,
    imageName: string,
    auctionType: string,
    status: string,
    endTime: number,
    currentBidPrice: number,
    imageUrl?: string,
  ) {
    this.itemId = itemId;
    this.name = name;
    this.description = description;
    this.imageName = imageName;
    this.auctionType = auctionType;
    this.status = status;
    this.endTime = endTime;
    this.currentBidPrice = currentBidPrice;
    this.imageUrl = imageUrl;
  }
}

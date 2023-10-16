export class ActiveItem {
  id: number;

  sellerId: number;

  name: string;

  description: string;

  imageName: string;

  createdAt: Date;

  hasBeenSold: boolean;

  auctionType: string;

  imageUrl: string;

  constructor(
    id: number,
    sellerId: number,
    name: string,
    description: string,
    imageName: string,
    createdAt: Date,
    hasBeenSold: boolean,
    auctionType: string,
    imageUrl?: string,
  ) {
    this.id = id;
    this.sellerId = sellerId;
    this.name = name;
    this.description = description;
    this.imageName = imageName;
    this.createdAt = createdAt;
    this.hasBeenSold = hasBeenSold;
    this.auctionType = auctionType;
    this.imageUrl = imageUrl;
  }
}

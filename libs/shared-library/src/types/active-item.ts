export class ActiveItem {
  id: number;

  sellerId: number;

  name: string;

  description: string;

  imageName: string;

  created_at: Date;

  hasBeenSold: boolean;

  auctionType: string;

  imageUrl: string;

  constructor(
    id: number,
    sellerId: number,
    name: string,
    description: string,
    imageName: string,
    created_at: Date,
    hasBeenSold: boolean,
    auctionType: string,
    imageUrl?: string,
  ) {
    this.id = id;
    this.sellerId = sellerId;
    this.name = name;
    this.description = description;
    this.imageName = imageName;
    this.created_at = created_at;
    this.hasBeenSold = hasBeenSold;
    this.auctionType = auctionType;
    this.imageUrl = imageUrl;
  }
}

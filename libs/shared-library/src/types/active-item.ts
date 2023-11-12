export class ActiveItem {
  id: number;

  seller_id: number;

  name: string;

  description: string;

  image_name: string;

  created_at: number;

  has_been_sold: boolean;

  auctionType: string;

  image_url: string;

  constructor(
    id: number,
    seller_id: number,
    name: string,
    description: string,
    image_name: string,
    created_at: number,
    has_been_sold: boolean,
    auctionType: string,
    image_url?: string,
  ) {
    this.id = id;
    this.seller_id = seller_id;
    this.name = name;
    this.description = description;
    this.image_name = image_name;
    this.created_at = created_at;
    this.has_been_sold = has_been_sold;
    this.auctionType = auctionType;
    this.image_url = image_url;
  }
}

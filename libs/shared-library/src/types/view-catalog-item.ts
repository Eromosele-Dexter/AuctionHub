export class CatalogItem {
  item_id: number; // item_id

  name: string;

  description: string;

  image_name: string;

  auctionType: string;

  end_time: number;

  current_bid_price: number;

  image_url: string;

  constructor(
    item_id: number, // item_id
    name: string,
    description: string,
    image_name: string,
    auctionType: string,
    end_time: number,
    current_bid_price: number,
    image_url?: string,
  ) {
    this.item_id = item_id;
    this.name = name;
    this.description = description;
    this.image_name = image_name;
    this.auctionType = auctionType;
    this.end_time = end_time;
    this.current_bid_price = current_bid_price;
    this.image_url = image_url;
  }
}

export class ViewListingItem {
  listing_item_id: number;

  name: string;

  description: string;

  image_name: string;

  auction_type: string;

  status: string;

  end_time: number;

  current_bid_price: number;

  image_url: string;

  constructor(
    listing_item_id: number,
    name: string,
    description: string,
    image_name: string,
    auctionType: string,
    status: string,
    end_time: number,
    current_bid_price: number,
    image_url?: string,
  ) {
    this.listing_item_id = listing_item_id;
    this.name = name;
    this.description = description;
    this.image_name = image_name;
    this.auction_type = auctionType;
    this.status = status;
    this.end_time = end_time;
    this.current_bid_price = current_bid_price;
    this.image_url = image_url;
  }
}

export class CheckOutItem {
  first_name: string;
  last_name: string;
  street_name: string;
  street_number: string;
  city: string;
  postal_code: string;
  bid_amount: number;
  shipping_cost: number;
  listing_item_id: number;
  item_name: string;

  constructor(
    first_name: string,
    last_name: string,
    street_name: string,
    street_number: string,
    city: string,
    postal_code: string,
    bid_amount: number,
    shipping_cost: number,
    listing_item_id: number,
    item_name: string,
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.street_name = street_name;
    this.street_number = street_number;
    this.city = city;
    this.postal_code = postal_code;
    this.bid_amount = bid_amount;
    this.shipping_cost = shipping_cost;
    this.listing_item_id = listing_item_id;
    this.item_name = item_name;
  }
}

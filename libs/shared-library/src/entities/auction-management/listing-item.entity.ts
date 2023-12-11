import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'listing_items' })
export class ListingItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'item_id' })
  item_id: number;

  @Column({ name: 'seller_id' })
  seller_id: number;

  @Column({ name: 'starting_bid_price' })
  starting_bid_price: number;

  @Column()
  description: string;

  @Column({ name: 'image_name' })
  image_name: string;

  @Column({ name: 'image_url' })
  image_url: string;

  @Column({ name: 'auction_type_id' })
  auction_type_id: number;

  // this is the time the auction ends
  @Column({ name: 'end_time', type: 'bigint' })
  end_time: number; // if it is a dutch auction, this value is not shown to the bidders

  @Column({ name: 'decrement_amount', nullable: true })
  decrement_amount: number; // if the auction is a dutch auction, this is the amount to decrement the price by

  @Column({ name: 'created_at', type: 'bigint' })
  created_at: number;

  @Column({ name: 'has_been_sold' })
  has_been_sold: boolean;

  constructor(
    name: string,
    item_id: number,
    seller_id: number,
    starting_bid_price: number,
    description: string,
    image_name: string,
    image_url: string,
    auction_type_id: number,
    end_time: number,
    decrement_amount: number,
    created_at: number,
    has_been_sold: boolean,
  ) {
    this.name = name;
    this.item_id = item_id;
    this.seller_id = seller_id;
    this.starting_bid_price = starting_bid_price;
    this.description = description;
    this.image_name = image_name;
    this.image_url = image_url;
    this.auction_type_id = auction_type_id;
    this.end_time = end_time;
    this.decrement_amount = decrement_amount;
    this.created_at = created_at;
    this.has_been_sold = has_been_sold;
  }
}

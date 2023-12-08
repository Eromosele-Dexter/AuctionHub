import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auction_items' })
export class AuctionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'listing_item_id' })
  // @OneToOne(() => Item, (item) => item.id, { nullable: false })
  listing_item_id: number;

  @Column({ name: 'seller_id' })
  seller_id: number;

  // this is the time the auction ends
  @Column({ name: 'end_time', type: 'bigint' })
  end_time: number; // if it is a dutch auction, this value is not shown to the bidders

  @Column({ name: 'starting_bid_price' })
  starting_bid_price: number;

  @Column({ name: 'current_bid_price' })
  current_bid_price: number;

  @Column({ name: 'decrement_amount', nullable: true })
  decrement_amount: number; // if the auction is a dutch auction, this is the amount to decrement the price by

  @Column({ name: 'image_url' })
  image_url: string;

  @Column({ name: 'auction_type' })
  auction_type: string;

  @Column({ name: 'has_been_sold' })
  has_been_sold: boolean;

  constructor(
    listing_item_id: number,
    seller_id: number,
    end_time: number,
    starting_bid_price: number,
    current_bid_price: number,
    name: string,
    description: string,
    image_url: string,
    auction_type: string,
    has_been_sold: boolean,
    decrement_amount?: number,
  ) {
    this.listing_item_id = listing_item_id;
    this.seller_id = seller_id;
    this.end_time = end_time;
    this.starting_bid_price = starting_bid_price;
    this.current_bid_price = current_bid_price;
    this.name = name;
    this.description = description;
    this.image_url = image_url;
    this.auction_type = auction_type;
    this.has_been_sold = has_been_sold;
    this.decrement_amount = decrement_amount;
  }
}

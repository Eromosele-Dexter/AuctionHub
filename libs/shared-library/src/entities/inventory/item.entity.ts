import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @Column({ name: 'seller_id' })
  seller_id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'image_name' })
  image_name: string;

  @Column({ name: 'created_at', type: 'bigint' })
  created_at: number;

  @Column({ name: 'auction_type_id' })
  auction_type_id: number;

  @Column({ name: 'has_been_sold' })
  has_been_sold: boolean;

  @Column({ name: 'starting_bid_price', default: 0 })
  starting_bid_price: number; //remove later

  @Column({ name: 'image_url' })
  image_url: string;

  constructor(
    seller_id: number,
    name: string,
    description: string,
    image_name: string,
    created_at: number,
    auction_type_id: number,
    has_been_sold: boolean,
    starting_bid_price: number,
    image_url?: string,
  ) {
    this.seller_id = seller_id;
    this.name = name;
    this.description = description;
    this.image_name = image_name;
    this.created_at = created_at;
    this.auction_type_id = auction_type_id;
    this.has_been_sold = has_been_sold;
    this.starting_bid_price = starting_bid_price;
    this.image_url = image_url;
  }
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'image_name' })
  imageName: string;

  @Column({ name: 'created_at' })
  created_at: Date;

  @Column({ name: 'auction_type_id' })
  auctionTypeId: number;

  @Column({ name: 'has_been_sold' })
  hasBeenSold: boolean;

  @Column({ name: 'starting_bid_price', default: 0 })
  startingBidPrice: number; //remove later

  @Column({ name: 'image_url' })
  imageUrl: string;

  constructor(
    sellerId: number,
    name: string,
    description: string,
    imageName: string,
    created_at: Date,
    auctionTypeId: number,
    hasBeenSold: boolean,
    startingBidPrice: number,
    imageUrl?: string,
  ) {
    this.sellerId = sellerId;
    this.name = name;
    this.description = description;
    this.imageName = imageName;
    this.created_at = created_at;
    this.auctionTypeId = auctionTypeId;
    this.hasBeenSold = hasBeenSold;
    this.startingBidPrice = startingBidPrice;
    this.imageUrl = imageUrl;
  }
}

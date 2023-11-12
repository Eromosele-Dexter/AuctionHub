import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'listing_items' })
export class ListingItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'item_id' })
  itemId: number;

  @Column({ name: 'seller_id' })
  sellerId: number;

  @Column({ name: 'starting_bid_price' })
  startingBidPrice: number;

  @Column()
  description: string;

  @Column({ name: 'image_name' })
  imageName: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'auction_type_id' })
  auctionTypeId: number;

  // this is the time the auction ends
  @Column({ name: 'end_time' })
  endTime: Date; // if it is a dutch auction, this value is not shown to the bidders

  @Column({ name: 'decrement_amount', nullable: true })
  decrementAmount: number; // if the auction is a dutch auction, this is the amount to decrement the price by

  @Column({ name: 'created_at' })
  created_at: Date;

  @Column({ name: 'has_been_sold' })
  hasBeenSold: boolean;

  constructor(
    name: string,
    itemId: number,
    sellerId: number,
    startingBidPrice: number,
    description: string,
    imageName: string,
    imageUrl: string,
    auctionTypeId: number,
    endTime: Date,
    decrementAmount: number,
    created_at: Date,
    hasBeenSold: boolean,
  ) {
    this.name = name;
    this.itemId = itemId;
    this.sellerId = sellerId;
    this.startingBidPrice = startingBidPrice;
    this.description = description;
    this.imageName = imageName;
    this.imageUrl = imageUrl;
    this.auctionTypeId = auctionTypeId;
    this.endTime = endTime;
    this.decrementAmount = decrementAmount;
    this.created_at = created_at;
    this.hasBeenSold = hasBeenSold;
  }
}

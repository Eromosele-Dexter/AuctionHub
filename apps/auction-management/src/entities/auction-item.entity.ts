import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auction_items' })
export class AuctionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id' })
  // @OneToOne(() => Item, (item) => item.id, { nullable: false })
  itemId: number;

  // this is the time the auction ends
  @Column({ name: 'end_time', type: 'bigint' })
  endTime: number; // if it is a dutch auction, this value is not shown to the bidders

  @Column({ name: 'starting_bid_price' })
  startingBidPrice: number;

  @Column({ name: 'current_bid_price' })
  currentBidPrice: number;

  @Column({ name: 'decrement_amount', nullable: true })
  decrementAmount: number; // if the auction is a dutch auction, this is the amount to decrement the price by

  constructor(
    itemId: number,
    endTime: number,
    startingBidPrice: number,
    currentBidPrice: number,
    decrementAmount?: number,
  ) {
    this.itemId = itemId;
    this.endTime = endTime;
    this.startingBidPrice = startingBidPrice;
    this.currentBidPrice = currentBidPrice;
    this.decrementAmount = decrementAmount;
  }
}

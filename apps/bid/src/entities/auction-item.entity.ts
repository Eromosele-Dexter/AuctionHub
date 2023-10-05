import { AuctionType } from 'apps/inventory/src/entities/auction-type.entity';
import { Item } from 'apps/inventory/src/entities/item.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'auction_items' })
export class AuctionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // @OneToOne(() => Item, (item) => item.id, { nullable: false })
  itemId: number;

  @Column()
  // @ManyToOne(() => AuctionType, (auctionType) => auctionType.id, {
  //   nullable: false,
  // })
  auctionTypeId: number;

  // this is the time the auction ends
  @Column()
  duration: number; // if it is a dutch auction, this value is not shown to the bidders

  @Column()
  startingBidPrice: number;

  @Column()
  currentBidPrice: number;

  @Column({ nullable: true })
  decrementAmount: number; // if the auction is a dutch auction, this is the amount to decrement the price by
}

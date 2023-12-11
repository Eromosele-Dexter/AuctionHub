import { User } from '@app/shared-library/entities/auth/user.entity';
import { Item } from '@app/shared-library/entities/inventory/item.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bids' })
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // @ManyToOne(() => User, (user) => user.id, { nullable: false })
  bidder_id: number;

  @Column()
  // @ManyToOne(() => Item, (item) => item.id, { nullable: false })
  listing_item_id: number;

  @Column()
  bid_amount: number;

  @Column({ type: 'bigint' })
  created_at: number;

  constructor(bidder_id: number, listing_item_id: number, bid_amount: number, created_at: number) {
    this.bidder_id = bidder_id;
    this.listing_item_id = listing_item_id;
    this.bid_amount = bid_amount;
    this.created_at = created_at;
  }
}

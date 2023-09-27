import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuctionListing } from './auction-listing.entity';
import { Item } from 'apps/inventory/src/entities/item.entity';

@Entity({ name: 'auction_listing_items' })
export class AuctionListingItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => AuctionListing, (auctionListing) => auctionListing.id, {
    nullable: false,
  })
  auctionListingId: number;

  @Column()
  @OneToOne(() => Item, (item) => item.id, { nullable: false })
  itemId: number;
}

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
  @OneToOne(() => Item, (item) => item.id, { nullable: false }) // try it out and see results, if it doesnt work, then delete the mapping since it is essentially being mapped to another enttity in another database
  itemId: number;
}

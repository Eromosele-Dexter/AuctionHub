import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'watch_list_items' })
export class WatchListItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // @OneToOne(() => WatchList, (watchList) => watchList.id, { nullable: false })
  bidder_id: number;

  @Column()
  listing_item_id: number;

  constructor(bidder_id: number, listing_item_id: number) {
    this.bidder_id = bidder_id;
    this.listing_item_id = listing_item_id;
  }
}

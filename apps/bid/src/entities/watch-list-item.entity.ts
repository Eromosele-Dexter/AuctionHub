import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'watch_list_items' })
export class WatchListItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // @OneToOne(() => WatchList, (watchList) => watchList.id, { nullable: false })
  bidderId: number;

  @Column()
  auction_item_id: number;
}

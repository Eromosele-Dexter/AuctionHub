import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WatchList } from './watch-list.entity';
import { AuctionItem } from './auction-item.entity';

@Entity({ name: 'watch_list_items' })
export class WatchListItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @OneToOne(() => WatchList, (watchList) => watchList.id, { nullable: false })
  watchListId: number;

  @Column()
  @ManyToOne(() => AuctionItem, (auctionItem) => auctionItem.id, {
    nullable: false,
  })
  auctionItemId: number;
}
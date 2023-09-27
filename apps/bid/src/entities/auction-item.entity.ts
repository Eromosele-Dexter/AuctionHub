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
  @OneToOne(() => Item, (item) => item.id, { nullable: false })
  itemId: number;

  @Column()
  @ManyToOne(() => AuctionType, (auctionType) => auctionType.id, {
    nullable: false,
  })
  auctionTypeId: number;

  @Column()
  duration: number;

  @Column()
  startingBidPrice: number;
}

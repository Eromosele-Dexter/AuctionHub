import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';
import { Keyword } from './keyword.entity';

@Entity({ name: 'item_keywords' })
export class ItemKeyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'listing_item_id' })
  // @ManyToOne(() => Item, (item) => item.id, { nullable: false })
  listing_item_id: number;

  @Column({ name: 'keyword_id' })
  // @ManyToOne(() => Keyword, (keyword) => keyword.id, { nullable: false })
  keywordId: number;

  constructor(listing_item_id: number, keywordId: number) {
    this.listing_item_id = listing_item_id;
    this.keywordId = keywordId;
  }
}

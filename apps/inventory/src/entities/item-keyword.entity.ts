import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';
import { Keyword } from './keyword.entity';

@Entity({ name: 'item_keywords' })
export class ItemKeyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id' })
  // @ManyToOne(() => Item, (item) => item.id, { nullable: false })
  itemId: number;

  @Column({ name: 'keyword_id' })
  // @ManyToOne(() => Keyword, (keyword) => keyword.id, { nullable: false })
  keywordId: number;

  constructor(itemId: number, keywordId: number) {
    this.itemId = itemId;
    this.keywordId = keywordId;
  }
}

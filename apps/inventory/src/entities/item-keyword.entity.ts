import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';
import { Keyword } from './keyword.entity';

@Entity({ name: 'item_keywords' })
export class ItemKeyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id' })
  // @ManyToOne(() => Item, (item) => item.id, { nullable: false })
  item_id: number;

  @Column({ name: 'keyword_id' })
  // @ManyToOne(() => Keyword, (keyword) => keyword.id, { nullable: false })
  keywordId: number;

  constructor(item_id: number, keywordId: number) {
    this.item_id = item_id;
    this.keywordId = keywordId;
  }
}

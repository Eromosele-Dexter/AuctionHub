import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';
import { Keyword } from './keyword.entity';

@Entity({ name: 'item_keywords' })
export class ItemKeyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Item, (item) => item.id, { nullable: false })
  itemId: number;

  @Column()
  @ManyToOne(() => Keyword, (keyword) => keyword.id, { nullable: false })
  keywordId: number;
}

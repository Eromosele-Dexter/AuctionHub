import { User } from 'apps/auth/src/entities/user.entity';
import { Item } from 'apps/inventory/src/entities/item.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bids' })
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  bidderId: number;

  @Column()
  @ManyToOne(() => Item, (item) => item.id, { nullable: false })
  itemId: number;

  @Column()
  bidAmount: number;

  @Column()
  createdAt: Date;
}

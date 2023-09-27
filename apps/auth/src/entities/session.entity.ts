import { Item } from 'apps/inventory/src/entities/item.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'sessions' })
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  buyerId: number;

  @Column()
  @ManyToOne(() => Item, (item) => item.id, { nullable: false })
  itemId: number;

  @Column()
  startTime: Date;
}

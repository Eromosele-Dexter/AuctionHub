import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'apps/auth/src/entities/user.entity';

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  sellerId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  createdAt: Date;
}

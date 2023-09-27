import { User } from 'apps/auth/src/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'watch_lists' })
export class WatchList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  buyerId: number;

  @Column()
  name: string;
}

import { User } from 'apps/auth/src/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auction_listings' })
export class AuctionListing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @OneToOne(() => User, (user) => user.id, { nullable: false })
  sellerId: number;
}

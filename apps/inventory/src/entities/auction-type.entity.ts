import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auction_types' })
export class AuctionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

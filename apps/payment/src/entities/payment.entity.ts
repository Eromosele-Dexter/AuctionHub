// import { User } from 'apps/auth/src/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // @OneToOne(() => User, (user) => user.id, { nullable: false })
  bidder_id: number;

  @Column()
  shipment_cost: number;

  @Column()
  amount: number;

  @Column({ type: 'bigint' })
  created_at: number;

  constructor(bidder_id: number, shipment_cost: number, amount: number, created_at: number) {
    this.bidder_id = bidder_id;
    this.shipment_cost = shipment_cost;
    this.amount = amount;
    this.created_at = created_at;
  }
}

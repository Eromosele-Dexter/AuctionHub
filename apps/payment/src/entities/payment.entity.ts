// import { User } from 'apps/auth/src/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  // @OneToOne(() => User, (user) => user.id, { nullable: false })
  bidderId: number;

  @Column()
  shipmentCost: number;

  @Column()
  amount: number;

  @Column({ type: 'bigint' })
  created_at: number;
}

import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { ISession } from 'connect-typeorm';

@Entity({ name: 'sessions' })
export class Session implements ISession {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id = '';

  @Index()
  @Column('bigint')
  expiredAt = Date.now();

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  destroyedAt?: Date;

  @Column({ type: 'text' })
  json = '';

  @Column({ type: 'boolean', default: false })
  has_active_bid: boolean;

  @Column({ type: 'int', nullable: true })
  listing_item_id: number;

  constructor(id: string, expiredAt: number, json: string, has_active_bid: boolean, listing_item_id?: number) {
    this.id = id;
    this.expiredAt = expiredAt;
    this.json = json;
    this.has_active_bid = has_active_bid;
    this.listing_item_id = listing_item_id;
  }
}

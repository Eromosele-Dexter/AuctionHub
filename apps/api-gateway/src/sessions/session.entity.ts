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
}

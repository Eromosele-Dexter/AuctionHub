import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @Column({ name: 'seller_id' })
  sellerId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('bytea') // Store image content as binary data
  image: Buffer;

  @Column()
  createdAt: Date;

  @Column({ name: 'auction_type_id' })
  auctionTypeId: number;

  constructor(
    sellerId: number,
    name: string,
    description: string,
    image: any,
    createdAt: Date,
    auctionTypeId: number,
  ) {
    this.sellerId = sellerId;
    this.name = name;
    this.description = description;
    this.image = image;
    this.createdAt = createdAt;
    this.auctionTypeId = auctionTypeId;
  }
}

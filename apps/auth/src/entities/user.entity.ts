import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bidders' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column()
  streetAddress: string;

  @Column()
  streetNumber: string;

  @Column()
  postalCode: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  first_name: string;

  @Column({ name: 'last_name' })
  last_name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column({ name: 'street_name' })
  street_name: string;

  @Column({ name: 'street_number' })
  street_number: string;

  @Column({ name: 'postal_code' })
  postal_code: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ name: 'created_at', type: 'bigint' })
  created_at: number;

  @Column({ name: 'updated_at', nullable: true, type: 'bigint' })
  updated_at: number;

  constructor(
    first_name: string,
    last_name: string,
    username: string,
    password: string,
    email: string,
    role: string,
    street_name: string,
    street_number: string,
    postal_code: string,
    city: string,
    country: string,
    created_at: number,
    updated_at?: number,
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
    this.street_name = street_name;
    this.street_number = street_number;
    this.postal_code = postal_code;
    this.city = city;
    this.country = country;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

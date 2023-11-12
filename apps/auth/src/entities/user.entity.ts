import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column({ name: 'street_name' })
  streetName: string;

  @Column({ name: 'street_number' })
  streetNumber: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ name: 'created_at' })
  created_at: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  constructor(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string,
    role: string,
    streetName: string,
    streetNumber: string,
    postalCode: string,
    city: string,
    country: string,
    created_at: Date,
    updatedAt?: Date,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
    this.streetName = streetName;
    this.streetNumber = streetNumber;
    this.postalCode = postalCode;
    this.city = city;
    this.country = country;
    this.created_at = created_at;
    this.updatedAt = updatedAt;
  }
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
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
  streetName: string;

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

  @Column({ nullable: true })
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
    createdAt: Date,
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
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

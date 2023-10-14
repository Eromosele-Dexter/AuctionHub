import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'validation_codes' })
export class ValidationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code: number;

  constructor(email: string, code: number) {
    this.email = email;
    this.code = code;
  }
}

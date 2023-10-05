import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'keywords' })
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

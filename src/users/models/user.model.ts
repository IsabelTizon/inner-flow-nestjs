import { Sequence } from 'src/users/models/sequence.model';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column()
  name: string;

  // { unique: true }: Prevents two users from registering with the same email.
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Sequence, (sequence) => sequence.user)
  sequences: Sequence[];
}

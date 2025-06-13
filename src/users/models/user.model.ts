import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sequence } from './sequence.model';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

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
  passwordHash: string;

  @Column({
    // type: 'enum',
    type: 'text',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Sequence, (sequence) => sequence.user)
  sequences: Sequence[];
}

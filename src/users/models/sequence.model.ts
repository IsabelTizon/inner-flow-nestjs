import { Poses } from '../../poses/models/poses.model';
import { User } from '../../users/models/user.model';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm';

@Entity('sequences')
@Unique(['name', 'user']) // prevents the same user from having 2 sequences with the same name
export class Sequence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  //{ onDelete: 'CASCADE' }:  If the user is deleted, all sequences associated with him are also automatically deleted.
  // many sequences for one user
  @ManyToOne(() => User, (user) => user.sequences, { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Poses)
  @JoinTable({ name: 'sequence_poses' })
  poses: Poses[];
}

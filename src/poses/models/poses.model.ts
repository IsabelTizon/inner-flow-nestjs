import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('poses')
export class Poses {
  @PrimaryGeneratedColumn({})
  public readonly id: string;
  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public image: string;
}

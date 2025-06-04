import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('poses')
export class Poses {
  // Error:QueryFailedError: SQLITE_MISMATCH: datatype mismatch
  // Solution @PrimaryGeneratedColumn('uuid')
  // uuid was added in @PrimaryGeneratedColumn() porque sin especificar un tipo, TypeORM estaba usando un entero autoincremental por defecto, pero la tabla estaba definida con el tipo TEXT para la columna id.

  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;
  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public image: string;
}

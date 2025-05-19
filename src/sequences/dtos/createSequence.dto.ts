import { IsString, Length, IsArray } from 'class-validator';
import { Poses } from '../../poses/models/poses.model';

export class CreateSequenceDto {
  @IsString()
  @Length(3, 30)
  readonly name: string;

  @IsArray()
  poses: Poses[];

  @IsString()
  userId: string;
}

import { IsString, Length } from 'class-validator';
export class addPoseDto {
  @IsString()
  @Length(3, 30)
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly image: string;
}
